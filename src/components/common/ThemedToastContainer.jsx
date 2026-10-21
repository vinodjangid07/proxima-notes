import { ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";

const ThemedToastContainer = () => {
  const { resolvedTheme } = useTheme();

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={2400}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastClassName="proxima-toast"
      bodyClassName="proxima-toast-body"
      progressClassName="proxima-toast-progress"
    />
  );
};

export default ThemedToastContainer;
