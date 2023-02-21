import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Moralis from "moralis-v1";
import { navigate } from "gatsby";
import { toast } from "react-toastify";
import { useMoralis } from "react-moralis";

// hooks
import { useModalContext } from "../../hooks/ModalContext";
import useUser, { UserLoginError } from "../../hooks/UserContext";

// components
import Dropdown from "../Dropdown";

const Login = ({ displayAsButtons = false }) => {
  const { logUserOut, connectWallet } = useUser();
  const { showModal } = useModalContext();
  const { authenticate } = useMoralis();

  const handleLogin = async (
    event: React.MouseEvent,
    provider: Moralis.Web3ProviderType = "metamask"
  ) => {
    event.preventDefault();
    const id = toast.loading("Logging in...", { autoClose: 4000 });

    try {
      const user = await authenticate({
        provider,
        signingMessage: "Code4rena login",
      });
      if (user === undefined) {
        let message: string | React.ReactNode = "";
        // @ts-ignore // @todo: fix typescript error
        if (typeof window.ethereum === "undefined") {
          // user does not have MetaMask installed
          message = (
            <>
              Please{" "}
              <a href="https://metamask.io/" target="_blank" rel="noreferrer">
                install MetaMask
              </a>
            </>
          );
        } else {
          // user clicked "cancel" when prompted to sign message
          // @todo: update messaging
          message = "You must sign the message to connect your wallet";
        }
        toast.update(id, {
          render: message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
        return;
      }
    } catch (error) {
      logUserOut();
      console.error("authenticate failed:", error);
      toast.update(id, {
        render: "Something went wrong. Please refresh the page and try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
      return;
    }

    try {
      await connectWallet();
      toast.update(id, {
        render: "Logged in",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });
    } catch (error) {
      logUserOut();
      if (error === UserLoginError.Unregistered) {
        toast.update(id, {
          render: "Please register",
          type: "error",
          isLoading: false,
          autoClose: 2000,
          closeButton: true,
        });
        navigate("/register");
      } else if (error === UserLoginError.RegistrationPending) {
        toast.update(id, {
          render: (
            <span>
              It looks like your account registration is pending. Don't forget
              to join us in{" "}
              <a
                href="https://discord.gg/code4rena"
                target="_blank"
                rel="noreferrer"
              >
                Discord
              </a>{" "}
              and give us a howl in #i-want-to-be-a-warden so we can complete
              your registration.
            </span>
          ),
          type: "error",
          isLoading: false,
          autoClose: 4000,
          closeButton: true,
        });
      } else if (error === UserLoginError.ConnectionPending) {
        toast.update(id, {
          render:
            "Your request to connect your wallet is pending review. Check the progress in GitHub",
          type: "error",
          isLoading: false,
          autoClose: 4000,
          closeButton: true,
        });
      } else {
        console.error("connect wallet failed: ", error);
        toast.update(id, {
          render:
            "Something went wrong. Please refresh the page and try again.",
          type: "error",
          isLoading: false,
          autoClose: 4000,
          closeButton: true,
        });
      }
    }
  };

  const openLoginModal = (e: React.MouseEvent) => {
    e.preventDefault();
    showModal({
      title: "Log in",
      body: "",
      type: "login",
    });
  };

  return (
    <>
      {displayAsButtons ? (
        <div className={clsx("login__no-dropdown")}>
          <button
            type="button"
            onClick={(e) => handleLogin(e)}
            className={clsx("button", "login__button--smaller")}
          >
            <img
              src="/images/meta-mask-logo.svg"
              alt="logout icon"
              className={"login__icon"}
            />
            MetaMask
          </button>
          <button
            type="button"
            onClick={(e) => handleLogin(e, "walletConnect")}
            className={clsx("button", "login__button--smaller")}
          >
            <img
              src="/images/wallet-connect-logo.svg"
              alt="logout icon"
              className={"login__icon"}
            />
            WalletConnect
          </button>
          <button
            className={clsx("button", "login__button--smaller")}
            type="button"
            onClick={openLoginModal}
          >
            <img
              src="/images/sign-out.svg"
              alt="login icon"
              className={"login__icon"}
            />
            Log in
          </button>
        </div>
      ) : (
        <>
          <Dropdown
            wrapperClass={"login__button-wrapper"}
            triggerButtonClass={"login__button"}
            triggerButton="Connect"
            openOnHover={true}
            className={"login__desktop"}
          >
            <button
              type="button"
              onClick={(e) => handleLogin(e)}
              className={clsx("dropdown__button", "login__desktop")}
            >
              <img
                src="/images/meta-mask-logo.svg"
                alt="logout icon"
                className={"login__icon"}
              />
              MetaMask
            </button>
            <button
              type="button"
              onClick={(e) => handleLogin(e, "walletConnect")}
              className={clsx("dropdown__button", "login__desktop")}
            >
              <img
                src="/images/wallet-connect-logo.svg"
                alt="logout icon"
                className={"login__icon"}
              />
              WalletConnect
            </button>
            <button
              className={clsx("dropdown__button", "login__desktop")}
              type="button"
              onClick={openLoginModal}
            >
              <img
                src="/images/sign-out.svg"
                alt="login icon"
                className={"login__icon"}
              />
              Log in
            </button>
          </Dropdown>
          <div className={"login__mobile"}>
            <a
              href=""
              target="_blank"
              rel="noreferrer"
              onClick={(e) => handleLogin(e)}
              className={"login__link"}
            >
              <img
                src="/images/meta-mask-logo.svg"
                alt="logout icon"
                className={"login__icon"}
              />
              Connect MetaMask
            </a>
            <a
              href=""
              onClick={(e) => handleLogin(e, "walletConnect")}
              className={"login__link"}
            >
              <img
                src="/images/wallet-connect-logo.svg"
                alt="logout icon"
                className={"login__icon"}
              />
              Connect WalletConnect
            </a>
            <a href="" className={"login__link"} onClick={openLoginModal}>
              <img
                src="/images/sign-out.svg"
                alt="login icon"
                className={"login__icon"}
              />
              Log in
            </a>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
