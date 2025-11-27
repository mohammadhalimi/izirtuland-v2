import Kavenegar from "kavenegar";

const api = Kavenegar.KavenegarApi({
    apikey: process.env.KAVENEGAR_API_KEY!
});

// services/kavenegar.ts
export type SendSMSResult = {
  success: boolean;
  data?: any; // یا نوع دقیق response که از Kavenegar میاد
  message?: string;
  details?: any;
};

export const sendVerifyCode = (phone: string, code: string): Promise<SendSMSResult> => {
  return new Promise((resolve, reject) => {
    api.VerifyLookup(
      {
        receptor: phone,
        token: code,
        template: "porbar",
      },
      (response: any, status: number) => {
        console.log("Kavenegar status:", status);
        console.log("Kavenegar response:", response);

        if (response?.return?.status === 200) {
          resolve({ success: true, data: response });
        } else if (Array.isArray(response) && response.length > 0) {
          const firstMsg = response[0];
          if (firstMsg.status === 1 || firstMsg.status === 5) {
            resolve({ success: true, data: response });
          } else {
            reject({ success: false, message: "Failed to send SMS", details: response });
          }
        } else {
          reject({ success: false, message: "Failed to send SMS", details: response || "No response" });
        }
      }
    );
  });
};

