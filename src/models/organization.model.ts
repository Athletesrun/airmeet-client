export class Organization {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public website: string,
        public members: Object,
        public event: number,
        public picture: string
    ){}
}