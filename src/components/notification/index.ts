import { toast } from 'react-toastify';

export const useNotification = () => {
    function notify(message: string, level: "success" | "error" | "info" | "warning" | "default") {
        toast(message, {
            type: level
        })
    } 

    return {
        notify
    }
}