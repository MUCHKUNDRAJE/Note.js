import { GoogleLogin } from "react-google-login";

function Googleloginbutton() {
    const clientId = "594082529381-g8vomirmtk2gv5lqncb5bickempu3g60.apps.googleusercontent.com";

    const onSuccess = (response) => {
        console.log("Login Success:", response.profileObj);
        window.location.href = "http://localhost:5000/auth/google"; // Redirect to backend auth
      };

      const onFailure = (response) => {
        console.log("Login Failed:", response);
      };

  return (
   <>
     <GoogleLogin
      clientId={clientId}
      buttonText="Login with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={"single_host_origin"}
    />
   
   </>
  )
}

export default Googleloginbutton