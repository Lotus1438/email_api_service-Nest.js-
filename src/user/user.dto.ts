export class User {
  constructor(
    public role_id: string,
    public first_name: string,
    public last_name: string,
    public address: string,
    public birthdate: string,
    public email: string,
    public password: string,
    public username: string,
  ) {}
}
