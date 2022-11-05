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

  static generateRandomIntegers(intLength: number): number {
    const characters = "0123456789";
    let result = " ";

    for (let i = 0; i < intLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return parseInt(result, 10);
  }
}
