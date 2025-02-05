import { Link } from "gatsby";
import React, { ReactNode, useEffect, useState, useCallback } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";

// types
import { PaymentAddress } from "../../types/user";

// hooks
import { useModalContext } from "../hooks/ModalContext";
import useUser, { TeamInfo } from "../hooks/UserContext";

// components
import Card from "../components/Card";
import { Input } from "../components/Input";
import ProtectedPage from "../components/ProtectedPage";
import WardenDetails from "../components/WardenDetails";

const initialState = {
  discordUsername: "",
  gitHubUsername: "",
  email: "",
  polygonAddress: "",
  ethereumAddress: "",
};

const initialPaymentAddressesState = {
  polygonAddress: { address: "", id: "", chain: "polygon" },
  ethereumAddress: { address: "", id: "", chain: "ethereum" },
};

export default function AccountManagementPage() {
  // hooks
  const { isInitialized, isInitializing, user, Moralis } = useMoralis();
  const { currentUser, reFetchUser } = useUser();
  const { showModal } = useModalContext();

  // state
  const [state, setState] = useState<Record<string, string>>(initialState);
  const [authAddresses, setAuthAddresses] = useState<string[]>([]);
  const [storedPaymentAddresses, setStoredPaymentAddresses] = useState<
    Record<string, PaymentAddress>
  >(initialPaymentAddressesState);

  const initializeUserInfo = async (): Promise<void> => {
    const user = Moralis.User.current();
    if (!user) {
      return;
    }
    const { discordUsername, gitHubUsername, emailAddress } = currentUser;
    const accounts = await user.get("accounts");
    setAuthAddresses(accounts || []);

    const userQuery = new Moralis.Query("_User");
    userQuery.equalTo("objectId", currentUser.moralisId);

    const query = new Moralis.Query("PaymentAddress");
    query.matchesQuery("user", userQuery);
    const results = await query.find();
    const paymentAddresses = results.map((res) => {
      return {
        address: res.attributes.address,
        chain: res.attributes.chain,
        id: res.id,
      };
    });
    const polygonAddress =
      paymentAddresses.find((address) => address.chain === "polygon") ||
      initialPaymentAddressesState.polygonAddress;
    const ethereumAddress =
      paymentAddresses.find((address) => address.chain === "ethereum") ||
      initialPaymentAddressesState.ethereumAddress;
    setStoredPaymentAddresses({ polygonAddress, ethereumAddress });
    setState({
      polygonAddress: polygonAddress?.address,
      ethereumAddress: ethereumAddress?.address,
      discordUsername,
      gitHubUsername,
      email: emailAddress,
    });
  };

  useEffect(() => {
    if (!currentUser.isLoggedIn) {
      return;
    }
    initializeUserInfo();
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const validateDiscordUsername = (value) => {
    const discordUsernameRegex = new RegExp(/.*#[0-9]{4}/, "g");
    const isValid = discordUsernameRegex.test(value);
    if (!isValid) {
      return [
        "Make sure you enter your discord username, " +
          "and not your server nickname. It should end with '#' " +
          "followed by 4 digits.",
      ];
    }
    return [];
  };

  const validatePaymentAddress = (value): (string | ReactNode)[] => {
    const errors: string[] = [];
    if (value.length > 0 && value.length !== 42) {
      errors.push("Address must be 42 characters long");
    }
    return errors;
  };

  const handleSaveUserInfo = async (fieldName: string, value: string) => {
    if (!user) {
      return;
    }

    user.set(fieldName, value);
    try {
      await user.save();
      await reFetchUser();
      toast.success("Your information has been saved");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Your changes have not been saved");
      resetValue(fieldName);
    }
  };

  const handleSavePaymentAddress = useCallback(
    async (fieldName: string, newValue: string): Promise<void> => {
      const paymentAddress = storedPaymentAddresses[fieldName];
      if (!paymentAddress.id) {
        // Create a new payment address
        try {
          const newAddress = await Moralis.Cloud.run("addPaymentAddress", {
            address: newValue,
            chain: paymentAddress.chain || "polygon",
          });
          toast.success(
            `Your ${paymentAddress.chain} payment address has been saved`
          );
          const newSavedAddress = {
            chain: newAddress.attributes.chain,
            id: newAddress.id,
            address: newAddress.attributes.address,
          };
          setStoredPaymentAddresses((prevState) => {
            return { ...prevState, [fieldName]: newSavedAddress };
          });
        } catch (error) {
          console.error(error);
          toast.error(
            `An error occurred and your changes have not been saved: "${error.message}"`
          );
          setState((prevState) => {
            return {
              ...prevState,
              [fieldName]: "",
            };
          });
        }
      } else {
        // Edit an existing payment address
        try {
          const query = new Moralis.Query("PaymentAddress");
          const address = await query.get(paymentAddress.id);
          address.set("address", newValue);
          await address.save();
          toast.success(
            `Your ${paymentAddress.chain} payment address has been saved`
          );
        } catch (error) {
          console.error(error);
          toast.error("An error occurred. Your changes have not been saved");
          setState((prevState) => {
            return {
              ...prevState,
              [fieldName]: paymentAddress.address,
            };
          });
        }
      }
    },
    [storedPaymentAddresses]
  );

  const handleDelete = (team: TeamInfo) => {
    showModal({
      title: `Delete Team: ${team.username}`,
      body: `Are you sure you want to delete the team ${team.username}?`,
      primaryButtonAction: async () => deleteTeam(team),
      primaryButtonText: "Delete",
    });
  };

  const deleteTeam = useCallback(
    async (team: TeamInfo) => {
      if (!user || !isInitialized) {
        return;
      }
      const sessionToken = user.attributes.sessionToken;
      try {
        const response = await fetch("/.netlify/functions/manage-team", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": `Bearer ${sessionToken}`,
            "C4-User": currentUser.username,
          },
          body: JSON.stringify({ teamName: team.username }),
        });
        if (!response.ok) {
          toast.error("An error ocurred while trying to delete your team");
        } else {
          toast.info(
            "Success! Your request to delete your team has been submitted. It will take up to 48 hours to process your request."
          );
        }
      } catch (error) {
        toast.error(error.message);
      }
    },
    [user, isInitialized, currentUser]
  );

  const resetValue = (fieldName: string): void => {
    if (!isInitialized || !user) {
      return;
    }
    setState((prevState) => {
      return { ...prevState, [fieldName]: currentUser[fieldName] };
    });
  };

  const resetPassword = () => {
    showModal({
      title: "Reset Password",
      body: "Are you sure you want to reset your password?",
      primaryButtonText: "Reset",
      primaryButtonAction: async () => {
        try {
          await Moralis.Cloud.run("resetPassword");
          toast.info(
            "An email has been sent with a link to reset your password"
          );
        } catch (error) {
          toast.error(
            `Oops...something went wrong:  ${error.message || error}`
          );
        }
      },
    });
  };

  return (
    <ProtectedPage pageTitle="My Account | Code4rena">
      {isInitializing ? (
        // @todo: style a loading state
        <div>LOADING...</div>
      ) : (
        <div className="limited-width">
          <h1 className="page-header">Manage Account</h1>
          <form>
            <h2>Payment Information</h2>
            <Input
              label="Polygon Address"
              required={true}
              handleChange={handleChange}
              value={state.polygonAddress}
              name="polygonAddress"
              validator={validatePaymentAddress}
              toggleEdit={true}
              handleSaveInputValue={handleSavePaymentAddress}
              maxLength={42}
            />
            <Input
              label="Ethereum Address"
              handleChange={handleChange}
              value={state.ethereumAddress}
              name="ethereumAddress"
              validator={validatePaymentAddress}
              toggleEdit={true}
              handleSaveInputValue={handleSavePaymentAddress}
              maxLength={42}
            />
            <hr />
            <h2>User Information</h2>
            {authAddresses.length > 0 && (
              <>
                <span>Login Addresses</span>
                <ul>
                  {authAddresses.map((address) => (
                    <li>{address}</li>
                  ))}
                </ul>
              </>
            )}
            <Input
              label="Discord Username"
              handleChange={handleChange}
              value={state.discordUsername}
              name="discordUsername"
              required={true}
              validator={validateDiscordUsername}
              toggleEdit={true}
              handleSaveInputValue={handleSaveUserInfo}
            />
            <Input
              label="Email Address"
              handleChange={handleChange}
              value={state.email}
              name="email"
              required={true}
              toggleEdit={true}
              handleSaveInputValue={handleSaveUserInfo}
            />
            <Input
              label="Github Username"
              handleChange={handleChange}
              value={state.gitHubUsername}
              name="gitHubUsername"
              toggleEdit={true}
              handleSaveInputValue={handleSaveUserInfo}
            />
            <div>
              <button
                type="button"
                className="button cta-button"
                onClick={resetPassword}
              >
                Reset Password
              </button>
            </div>
            <hr />
            <h2>Team Information</h2>
            {(currentUser.teams || []).length === 0 ? (
              <p>You are not a member of any teams</p>
            ) : (
              <>
                <p>
                  <strong>Heads up!</strong> Changes you make to your team are
                  not immediately effective. It may take a few business days for
                  your changes to be reviewed and completed.
                </p>
                <div
                  className={currentUser.teams.length > 1 ? "card-wrapper" : ""}
                >
                  {currentUser.teams.map((team) => (
                    <Card
                      title={
                        <WardenDetails
                          username={team.username}
                          image={team.image}
                          avatarSize="40px"
                        />
                      }
                      buttons={
                        <>
                          <Link
                            to={`/manage-team?team=${team.username}`}
                            state={team}
                          >
                            <img src="/images/pencil.png" alt="edit" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(team)}
                          >
                            <img src="/images/trash-can.png" alt="delete" />
                          </button>
                        </>
                      }
                    >
                      <>
                        <h3>Members:</h3>
                        <ul>
                          {team.members.map((member) => (
                            <li>{member}</li>
                          ))}
                        </ul>
                        {team.ethereumAddress ||
                          (team.polygonAddress && (
                            <>
                              <h3>Payment addresses:</h3>
                              <ul>
                                {team.polygonAddress && (
                                  <li>
                                    polygon:{" "}
                                    {team.polygonAddress.slice(0, 5) +
                                      "..." +
                                      team.polygonAddress.slice(-4)}
                                  </li>
                                )}
                                {team.ethereumAddress && (
                                  <li>
                                    ethereum:{" "}
                                    {team.ethereumAddress.slice(0, 5) +
                                      "..." +
                                      team.ethereumAddress.slice(-4)}
                                  </li>
                                )}
                              </ul>
                            </>
                          ))}
                      </>
                    </Card>
                  ))}
                </div>
              </>
            )}
            <div>
              <Link
                to="/register-team"
                className="button cta-button centered secondary"
              >
                Create a new team
              </Link>
            </div>
          </form>
        </div>
      )}
    </ProtectedPage>
  );
}
