export class User {
    constructor (
        public id: number,
        public description: string,
        public interests: {
          interests: Array<String>,
        },
        public linkedin: string,
        public facebook: string,
        public twitter: string,
        public picture: string,
        public email: string,
        public password: string, //I know i know this is horrible. We'll fix it later. At least the password is hashed and salted
        public firstName: string,
        public lastName: string,
        public event: number,
        public lastMessage: string,
        public phone: string
    ) {}
}
