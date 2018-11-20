using System;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Web.Mail;
using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;

namespace AdminClient.Library
{
    public class Email
    {
        public static bool SendMail(string serverName, string from, string password, string smtpport, string to, string cc, string bcc, string subject, string messages, bool UseSSL, ref string error, params string[] Files)
        {
            try
            {
                MailAddress toMailAddress = new MailAddress(to);
                MailAddress fromMailAddress = new MailAddress(from);
                System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage(fromMailAddress, toMailAddress);
                SmtpClient client = new SmtpClient(serverName, Convert.ToInt32(smtpport));

                #region set value message
                message.Subject = subject;
                message.Body = messages;
                message.BodyEncoding = System.Text.Encoding.UTF8;
                message.IsBodyHtml = true;

                if (bcc != "")
                {
                    string[] arrayBcc = bcc.Split(',');
                    for (int i = 0; i < arrayBcc.Length; ++i)
                        message.Bcc.Add(new MailAddress(arrayBcc[i]));
                }

                if (cc != "")
                {
                    string[] arrayCc = cc.Split(',');
                    for (int i = 0; i < arrayCc.Length; ++i)
                        message.CC.Add(new MailAddress(arrayCc[i]));
                }

                if (Files.Length > 0)
                {
                    for (int i = 0; i < Files.Length; i++)
                    {
                        if (Files[i] != "")
                        {
                            message.Attachments.Add(new Attachment(Files[i]));
                        }
                    }
                }
                #endregion

                #region set value client
                client.Port = Convert.ToInt32(smtpport);
                client.UseDefaultCredentials = false;
                client.EnableSsl = UseSSL;

                client.Credentials = new System.Net.NetworkCredential(from, password);
                #endregion

                client.Send(message);

                return true;
            }
            catch (Exception ex)
            {
                error = ex.Message;
                return false;
            }
        }

        public static bool SendEmailSES(string from, string fromname, string to, string username, string pass, string host, int port, string subject, string body, bool UseSSL, string bcc)
        {

            // Create and build a new MailMessage object
            System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage();
            message.IsBodyHtml = true;
            message.From = new MailAddress(from, fromname);
            message.To.Add(new MailAddress(to));
            message.Subject = subject;
            message.Body = body;
            if (bcc != "")
                message.Bcc.Add(new MailAddress(bcc));



            using (var client = new System.Net.Mail.SmtpClient(host, port))
            {
                // Pass SMTP credentials
                client.Credentials =
                    new NetworkCredential(username, pass);

                // Enable SSL encryption
                client.EnableSsl = true;

                // Try to send the message. Show status in console.
                try
                {
                    client.Send(message);
                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public static string ConvertStringToHtml(string content, string TemplateBodyEmail)
        {
            if (content == null)
            {
                return "";
            }
            string ret = "";
            string[] lstr = content.Split(new string[] { "\n\n" }, StringSplitOptions.None);
            foreach (string item in lstr)
            {
                ret = ret + "<p>" + item.Replace("\n", "<br>") + "</p>";
            }
            if (TemplateBodyEmail == "")
                return ret;
            else
                return TemplateBodyEmail.Replace("@Content", ret);
        }
    }

    public class SMS
    {
        public static bool sendSMS(string content, string mobilenumber, string SMSAccessKeyID, string SMSSecretAccessKeyID, string SMSSenderID, ref string MessageId)
        {
            //AmazonSimpleNotificationServiceClient snsClient = new AmazonSimpleNotificationServiceClient(Amazon.RegionEndpoint.USWest2);
            AmazonSimpleNotificationServiceClient snsClient = new AmazonSimpleNotificationServiceClient(SMSAccessKeyID, SMSSecretAccessKeyID, Amazon.RegionEndpoint.USWest2);


            Dictionary<string, MessageAttributeValue> messageAttributes = new Dictionary<string, MessageAttributeValue>();
            MessageAttributeValue v1 = new MessageAttributeValue();
            v1.DataType = "String";
            v1.StringValue = SMSSenderID;
            messageAttributes.Add("AWS.SNS.SMS.SenderID", v1);
            MessageAttributeValue v2 = new MessageAttributeValue();
            v2.DataType = "String";
            v2.StringValue = "0.50";
            messageAttributes.Add("AWS.SNS.SMS.MaxPrice", v2);
            MessageAttributeValue v3 = new MessageAttributeValue();
            v3.DataType = "String";
            // Options: Promotional, Transactional
            v3.StringValue = "Transactional";
            messageAttributes.Add("AWS.SNS.SMS.SMSType", v3);
            //SendSMSMessageAsync(snsClient, "Hello from AWS SNS!", "+1 XXX YYYYYY", messageAttributes).Wait();
            //SendSMSMessageAsync(snsClient, content, mobilenumber, messageAttributes).Wait();

            PublishRequest publishRequest = new PublishRequest();
            publishRequest.PhoneNumber = mobilenumber;
            publishRequest.Message = content;
            publishRequest.MessageAttributes = messageAttributes;

            try
            {
                var response = snsClient.Publish(publishRequest);
                //Console.WriteLine(response.MessageId);
                MessageId = response.MessageId;
                return true;
            }
            catch (Exception e)
            {
                //Console.WriteLine(e.Message);
                MessageId = "";
                return false;
            }

        }
        static async Task SendSMSMessageAsync(AmazonSimpleNotificationServiceClient snsClient, string message, string phoneNumber,
            Dictionary<string, MessageAttributeValue> messageAttributes)
        {
            PublishRequest publishRequest = new PublishRequest();
            publishRequest.PhoneNumber = phoneNumber;
            publishRequest.Message = message;
            publishRequest.MessageAttributes = messageAttributes;

            try
            {
                var response = await snsClient.PublishAsync(publishRequest);
                Console.WriteLine(response.MessageId);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
