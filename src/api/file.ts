import request from '@/utils/request'

export const uploadImage = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    return request.post(`/v1/file/upload/img`, formData, config)
}
