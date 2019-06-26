export default interface Mod {
  name: string;
  enabled: boolean;
  dependency_error: string;
  sanctioned: boolean;
  id: string;
}
