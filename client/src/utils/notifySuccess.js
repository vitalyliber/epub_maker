import { toast } from "react-toastify";

function notifySuccess(text) {
  toast.success(text, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  });
}

export default notifySuccess;
