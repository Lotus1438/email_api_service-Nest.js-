export class Message {
  constructor(
    public recipient: string,
    public subject: string,
    public message: string,
    public sender: string,
  ) {}
}
