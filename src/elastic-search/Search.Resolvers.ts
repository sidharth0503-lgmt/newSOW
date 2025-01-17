
import mercury from "@mercury-js/core";
import { GraphQLError } from "graphql";5
import cron from "node-cron";
import nodemailer from "nodemailer";
import moment from "moment";
import jwt from "jsonwebtoken";


const Detail = mercury.db.Detail;


const managerEmailMap: { [key: string]: string } = {
  'Siddu': "siddharthrayudu0503@gmail.com",
  'Shashank':"shashanksonwane305@gmail.com",
 'Sudheer':"sudheer102002@gmail.com"
  
};


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "ramesh.gorekanti@gmail.com",
    pass: 'tgnariztsbdquylz'
  },
});


async function sendSOWStartAlerts() {
  try {
    console.log('Checking for resources with created dates in the last 5 minutes...');

    const fiveMinutesAgo = moment().subtract(5, 'minutes').toDate();
    const now = new Date();

    
    const recentResources = await Detail.mongoModel.find({
      statusCode: 'Active',
      createdOn: { $gte: fiveMinutesAgo, $lt: now }, 
      
    }).lean();

    if (recentResources.length === 0) {
      console.log('No new resources found with created dates in the last 5 minutes.');
      return;
    }

    
    const managerEmails = new Set<string>();
    for (const resource of recentResources) {
      const managerEmail = managerEmailMap[resource.reportingManager];
      if (managerEmail) {
        managerEmails.add(managerEmail);
      } else {
        console.log(`No email found for reporting manager ${resource.reportingManager} of resource ${resource.employeeName}.`);
      }
    }

    if (managerEmails.size === 0) {
      console.log('No valid manager emails found.');
      return;
    }

    
    const emailArray = Array.from(managerEmails);

    
    const emailContent = {
      from: "ramesh.gorekanti@gmail.com",
      to: emailArray,
      subject: 'Alert: New Resources Created in the Last 5 Minutes',
      text: `These is like an alert message:\n\n` +
            recentResources.map(resource => `- ${resource.employeeName} (Resource ID: ${resource.resourceId})`).join('\n'),
    };

    await transporter.sendMail(emailContent);
    console.log(`Alert sent to ${emailArray.length} managers.`);
  } catch (error) {
    console.error('Error in sendSOWStartAlerts:', error);
  }
}


cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('Starting scheduled SOW start alert check...');
    await sendSOWStartAlerts();
  } catch (error) {
    console.error('Error in scheduled cron task:', error);
  }
});

export default {
  Query: {
    hello: (_: any, { name }: { name: string }) => {
      try {
        console.log('Received hello query');
        return `Hello ${name || "World"}`;
      } catch (error) {
        console.error('Error in hello query:', error);
        throw new GraphQLError('Error in hello query');
      }
    },
  },

  Mutation: {
    signUp: async (_: any, { signUpData }: { signUpData: any }) => {
      try {
        console.log('SignUp Data:', signUpData);

        const userSchema = mercury.db.User;

        let existingUser;
        try {
          existingUser = await userSchema.mongoModel.findOne({ email: signUpData.email });
          console.log('Existing User:', existingUser);
        } catch (error) {
          console.error("Error checking existing user:", error);
          throw new GraphQLError("Error checking existing user.");
        }

        if (existingUser) {
          console.warn(`Signup attempted with existing email: ${signUpData.email}`);
          throw new GraphQLError("User already exists.");
        }

        const newUser = await userSchema.mongoModel.create({
          userName: signUpData.userName,
          email: signUpData.email,
          password: signUpData.password,
          role: signUpData.role,
        });
        console.log('New User:', newUser);

        return {
          id: newUser.id,
          msg: "User registered successfully.",
          role: newUser.role
        };
      } catch (error: any) {
        throw new GraphQLError(error);
      }
    },

    login: async (_: any, { email, password }: { email: string, password: string }) => {
      try {
        console.log('Login attempt for email:', email);

        const userSchema = mercury.db.User;

        const user = await userSchema.mongoModel.findOne({ email });
        if (!user) {
          console.error('User not found:', email);
          throw new GraphQLError("Invalid email or password.");
        }

        const isPasswordValid = await user.verifyPassword(password);
        if (!isPasswordValid) {
          console.error('Invalid password for email:', email);
          throw new GraphQLError("Invalid email or password.");
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET || "vithi",
          { expiresIn: "30d" }
        );

        console.log('User logged in successfully:', email);
        return {
          msg: "User successfully logged in.",
          user: user.id,
          userName: user.userName,
          token: token,
        };
      } catch (error: any) {
        throw new GraphQLError(error);
      }
    },
  },
};
