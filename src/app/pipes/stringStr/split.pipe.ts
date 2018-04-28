import { PipeTransform, Pipe } from '@angular/core';


@Pipe({ name: "stringStr" })
export class StringStr implements PipeTransform {
  transform(text: string, num: number): string {
    if (text.length < num) return text;
    let content = text.substr(0, num) + '...';
    return content;
  }
}