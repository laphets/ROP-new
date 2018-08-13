import { message } from 'vue-antd-ui'

export const errorMessage = (errmsg: string | any): void => {
    message.error(errmsg, 5 * 1000)
}
