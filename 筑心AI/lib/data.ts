export const moods=[{e:'😁',label:'很好',score:5},{e:'🙂',label:'还行',score:4},{e:'😐',label:'一般',score:3},{e:'😞',label:'不太好',score:2},{e:'😭',label:'很难受',score:1}]
export const weekly=[{day:'周一',mood:4,stress:5,sleep:7},{day:'周二',mood:4,stress:5,sleep:7},{day:'周三',mood:3,stress:6,sleep:6},{day:'周四',mood:2,stress:8,sleep:5},{day:'周五',mood:2,stress:8,sleep:4},{day:'周六',mood:3,stress:6,sleep:6},{day:'周日',mood:4,stress:5,sleep:7}]
export const dangerWords=['不想活','想死','伤害自己','伤害别人','结束生命','控制不住自己','活着没意思']
export type MoodEntry={score:number;tags:string[];note:string;date:string}
export function saveMood(entry:MoodEntry){ const old=JSON.parse(localStorage.getItem('zhuxin-moods')||'[]'); localStorage.setItem('zhuxin-moods',JSON.stringify([entry,...old])) }
