export default function getApiErrorMessage(error, fallbackMessage) {
  const serverMsg = error?.response?.data?.msg;
  if (serverMsg) return serverMsg;

  const status = error?.response?.status;
  if (status === 413) {
    return "Photo bahut badi hai. Chhoti image try karo.";
  }

  if (error?.code === "ECONNABORTED") {
    return "Request timeout ho gaya. Network check karke dobara try karo.";
  }

  if (!error?.response) {
    return "Network issue lag raha hai. Internet ya browser cache check karke dobara try karo.";
  }

  return fallbackMessage;
}
