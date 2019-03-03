import { message, notification } from 'ant-design-vue'

message.config({
    duration: 2,
});

export const errorMessage = (errmsg: string | any): void => {
    message.error(errmsg)
}
export const successMessage = (errmsg: string | any): void => {
    message.success(errmsg)
}
export const infoMessage = (errmsg: string | any): void => {
    message.info(errmsg)
}
export const warnMessage = (errmsg: string | any): void => {
    message.warn(errmsg)
}
export const loadMessage = (errmsg: string | any): void => {
    message.load(errmsg)
}

export const showNotice = (type: string, title: string, description: string, duration = 4.5) => {
    notification[type]({
        message: title,
        description,
        placement: 'bottomRight',
        duration
    });
}

