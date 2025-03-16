export class UserEntity {
    id: number;
    username: string;
    password: string;
    email: string;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
}