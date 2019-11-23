const request = require("request-promise");
const hook = "TP0TNB2SF/BQ0S386HZ/5mbCcppGVaGkgFlW8G7LtyCv";
const getTransactions = async function() {
  let logs = await request({
    url: "http://127.0.0.1:62235/transactions.json",
    json: true
  });

  return logs.data.map(log => ({
    name: log.name,
    transaction: log.transaction,
    status: log.status,
    amount: log.amount,
    date: log.date
  }));
};

(async function() {
  try {
    //get data
    const transLogs = await getTransactions();
    console.log(transLogs);
    //define slackbody
    const slackbody = {
      mkdwn: true,

      // text: `*Transaction Logs*`,
      attachments: transLogs.map(log => ({
        pretext: "Jiggle Tranaction Notification",
        title: "Transaction Log",
        color: "good",
        text: `*${log.name}* ${log.transaction} with ₦${log.amount}`
      }))
    };
    //send to slack
    const res = await request({
      url: `https://hooks.slack.com/services/${hook}`,
      method: "POST",
      body: slackbody,
      json: true
    });
    console.log(res);
  } catch (e) {
    console.log("Opps,Our Error", e);
  }
  debugger;
})();
