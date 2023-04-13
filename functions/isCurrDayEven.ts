export function isCurrDayEven() {
    const currentDate = new Date()
    const dayOfMonth = currentDate.getDate()
    if(dayOfMonth % 2 === 0) return true
    else return false
}