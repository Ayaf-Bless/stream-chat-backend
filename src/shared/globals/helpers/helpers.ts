export class Helper {
  static firstLetterUpper(str: string): string {
    return str
      .toLowerCase()
      .split(" ")
      .map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`)
      .join("");
  }
  static lower(str: string): string {
    return str.toLowerCase();
  }
}
