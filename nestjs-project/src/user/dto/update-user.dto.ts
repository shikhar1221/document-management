export class UpdateUserDto {
    readonly id: number;
    readonly username?: string;
    readonly email?: string;
    readonly password?: string;
    readonly role?: string;
}