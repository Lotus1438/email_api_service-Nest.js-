export class UserRole {
  constructor(
    public role: string,
    public priviledges: {
      has_read_access: boolean;
      has_add_access: boolean;
      has_edit_access: boolean;
      has_delete_access: boolean;
    },
  ) {}
}
