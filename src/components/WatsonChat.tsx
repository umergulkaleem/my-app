// components/WatsonChat.tsx
"use client";

import { useEffect } from "react";

const WatsonChat = () => {
  useEffect(() => {
    // Set configuration
    (window as any).wxOConfiguration = {
      orchestrationID:
        "948e0ab1354c4f30a1681e8831734b26_21367020-67ac-4dfa-838d-647adb98d8ce",
      hostURL: "https://eu-gb.watson-orchestrate.cloud.ibm.com",
      rootElementID: "root",
      deploymentPlatform: "ibmcloud",
      crn: "crn:v1:bluemix:public:watsonx-orchestrate:eu-gb:a/948e0ab1354c4f30a1681e8831734b26:21367020-67ac-4dfa-838d-647adb98d8ce::",
      chatOptions: {
        agentId: "a30745f6-3d99-4323-a248-519436d73736",
      },
    };

    // Dynamically load the Watson Orchestrate script
    const script = document.createElement("script");
    script.src = `${
      (window as any).wxOConfiguration.hostURL
    }/wxochat/wxoLoader.js?embed=true`;
    script.async = true;
    script.onload = () => {
      if ((window as any).wxoLoader) {
        (window as any).wxoLoader.init();
      }
    };
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <div id="root" style={{ width: "100%", height: "100%" }}></div>;
};

export default WatsonChat;
