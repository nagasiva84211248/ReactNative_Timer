interface ITimer {
    name:string,
    duration:string,
    category:string,
    PlaySingleTimer: boolean,
    ResetSingleTimer: boolean,
    progress:number,
    Status:string,
    remainingTimer:number,
    date:Date

}

interface ICategory{
    id:number
    categoryName:string,
    categoryList:ITimer[],
    expandCollapse?:boolean,
    playAllTimers?:boolean,
    ResetAllTimers?:boolean,
}