export class Helpers {
  static firstLetterUpperCase(letter: string): string {
    const valueString = letter.toLocaleLowerCase();

    return valueString
      .split(" ")
      .map((value: string) => `${value.charAt(0).toLocaleUpperCase()}${value.slice(1)}`)
      .join(" ");
  }

  static generateRandomIntegers(length: number) {
    const chars = "0123456789";
    let resuls = " ";
    const charLength = chars.length;
    for (let i = 0; i < length; i++) {
      resuls += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return parseInt(resuls, 10);
  }
}
