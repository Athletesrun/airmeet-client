export class Event {
    constructor(
        public id: number,
        public date: Date,
        public name: string,
        public description: string,
        public website: string,
        public organizer: string,
        public schedule: Object
    ){}
}