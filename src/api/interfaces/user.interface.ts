export interface UserInfoResponse {
    data: {
        readonly id: number;
        readonly ZJUid: string;
        readonly name: string;
        readonly department: string;
        readonly inner_id: string;
        readonly avatar: string;
        readonly admin_level: number;
        readonly association: {
            ID: number;
            department_list: string;
            name: string;
        }
    }
}
