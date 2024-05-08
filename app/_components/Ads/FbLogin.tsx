"use client";

import { Button } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { ConnectAdAccount } from "../../_services/adAccountService";
import { Toast } from 'primereact/toast';
import router from "next/router";

const app_id = process.env.FACEBOOK_ID;

const AccountLogin: React.FC = () => {

  useEffect(() => {
    const loadFacebookSDK = () => {
      const fbScript = document.createElement("script");
      fbScript.id = "facebook-jssdk";
      fbScript.src = "https://connect.facebook.net/en_US/sdk.js";
      document.getElementsByTagName("head")[0].appendChild(fbScript);

      fbScript.onload = () => {
        window.fbAsyncInit = () => {
          window.FB?.init({
            appId: "733989884793288",
            cookie: true,
            xfbml: true,
            version: "v18.0",
          });
        };
      };
    };
    loadFacebookSDK();
  }, []);
const toast = useRef<Toast>(null);

 const showSuccessToast = (message: string) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000,
    });
  };

  const showErrorToast = (message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error Message',
      detail: message,
      life: 3000,
    });
  };

  const adAccount = async (accessToken: string) => {
    try {
      const backendResponse = await ConnectAdAccount(accessToken);
      if (backendResponse.statusCode == "200") {
        localStorage.setItem('accesstoken_fb', backendResponse.responseData.longLiveToken);
        localStorage.setItem('adAccountId', backendResponse.responseData.adAccountId)
        localStorage.setItem('pageId', backendResponse.responseData.pages[0])
        showSuccessToast('Ad Account Connected successfully')
       } 
      else{
        showErrorToast(backendResponse.message);
      }      
    } catch (error) {
      showErrorToast('Could not connect ad account');
    }
  }
  const oauthSignIn = () => {
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    const params = {
      client_id: '195870252277-kgqnfto3d27fhvvhivk7m3ikfkc4qhvl.apps.googleusercontent.com',
      redirect_uri: 'https://localhost:3000/home',
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/adwords',
      include_granted_scopes: 'true',
      state: 'try_sample_request',
      access_type : 'offline'
    };

    const queryString = new URLSearchParams(params).toString();
    router.push(`${oauth2Endpoint}?${queryString}`);
  };

  const fblogin = () => {
    window.FB.login(
      (response: any) => {
        if (response.status === "connected") {
          console.log(response.authResponse.accessToken);
          adAccount(response.authResponse.accessToken);

          fetch(`/api/fblogin?token=${response.authResponse.accessToken}`).then(
            (response2) => console.log("Debug response: ", response2)
          );
        }
      },
      {
        scope:
          "email, read_insights, pages_show_list, ads_management, ads_read, business_management, pages_read_engagement,pages_manage_posts",
      }
    );
  };

  return (
    <>
      <Button
        onClick={fblogin}
        variant="contained"
        sx={{
          backgroundColor: "#597FB5 !important",
          color: "#fff !important",
          "&:hover": {
            backgroundColor: "#405D80 !important",
          },
        }}
      >
        {" "}
        Connect Ad Account
      </Button>
    </>
  );
};

export default AccountLogin;
