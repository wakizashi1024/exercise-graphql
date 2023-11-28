import { MongoDataSource } from "apollo-datasource-mongodb";

class Users extends MongoDataSource {
    // constructor(options) {
    //     super(options);
    // }

    findByEmail(email, { withPassword } = {}) {
        if (withPassword) {
            return this.model.findOne({ email: email }).select("+password");
        }
        return this.model.findOne({ email: email });
    }

    findByUserName(username, { withPassword } = {}) {
        if (withPassword) {
            return this.model.findOne({ username: username }).select("+password");
        }

        return this.model.findOne({ username: username });
    }

    findByUserId(userId, { withPassword } = {}) {
        if (withPassword) {
            return this.model.findById(userId).select("+password");
        }

        return this.model.findById(userId);
    }

    saveUser(args) {
        const user = new this.model(args);
        return user.save();
    }

    updateUser(userId, data) {
        return this.model.findOneAndUpdate(
            { _id: userId }, 
            data,
            { new: true } // 預設回傳舊資料(更新前的資料)
        );
    }
}

export { Users };
