export class Status {
    constructor(
        public status: string,
        public message: string,
        public results: string,
        public token: string,
        public id: string,
        public eventId: string,
        public event: number,
        public length: number
    ) {}
}
