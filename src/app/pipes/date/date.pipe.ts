import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: "dateStr" })
export class DateStr implements PipeTransform {
  transform(time: string): string {
    let minute = 1000 * 60,
      hour = minute * 60,
      day = hour * 24,
      halfamonth = day * 15,
      month = day * 30,
      year = month * 12,
      now = new Date().getTime(),
      diffValue = now - new Date(time).getTime();
    if (diffValue < 0) { return; }
    let yearC = diffValue / year,
     monthC = diffValue / month,
     weekC = diffValue / (7 * day),
     dayC = diffValue / day,
     hourC = diffValue / hour,
     minC = diffValue / minute;
     let result = "";
    if (yearC >= 1) {
      result = "" + parseInt(String(yearC)) + "年前"
    }
    if (monthC >= 1) {
      result = "" + parseInt(String(monthC)) + "月前";
    }
    else if (weekC >= 1) {
      result = "" + parseInt(String(weekC)) + "周前";
    }
    else if (dayC >= 1) {
      result = "" + parseInt(String(dayC)) + "天前";
    }
    else if (hourC >= 1) {
      result = "" + parseInt(String(hourC)) + "小时前";
    }
    else if (minC >= 1) {
      result = "" + parseInt(String(minC)) + "分钟前";
    } else
      result = "刚刚";
    return result;
  }
}