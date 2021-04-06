function main() {

  const variables = inputDatafromSpreadSheet();

  const endpoint = "https://api.smash.gg/gql/alpha";
  const tourneyURL = variables[0][0];
  const smashggURL = "https://smash.gg";
  const tourneySlug = tourneyURL.substring(smashggURL.length + 1,tourneyURL.length);
  const streamName = variables[0][1];
  const token = variables[0][2];


  // クエリの内容
  const graphqlQuery = `
  query StreamQueueOnTournament($tourneySlug: String!) {
    tournament(slug: $tourneySlug) {
      streamQueue {
        stream{
          streamName
        }
        sets {
          fullRoundText
          slots {
            entrant {
              participants{
                prefix
                gamerTag
                user{
                  authorizations(types: TWITTER) {
                    externalUsername
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  `;

  // POSTの内容のオブジェクト。この形式にして！とggの公式ドキュメントで指定されている。query部分のみ長いので別記
  const HTTPbody = {
      query: graphqlQuery,
      variables: { "tourneySlug": tourneySlug}
  };
  
  // POSTのBodyをJSON化
  const jsonBody = JSON.stringify(HTTPbody);

  // fetchでHTTPリクエストを送信
  const options = {
    method : "POST",
    headers : {
      "Authorization" : "Bearer " + token,
      "content-Type": "application/json",
      "Accept" : "application/json",
    },
    payload : jsonBody
  }
  const response = UrlFetchApp.fetch(endpoint, options);
  const code = response.getResponseCode();
  const content = response.getContentText();
  
  /*
  //HTTPレスポンスの内容
  Logger.log(code);
  Logger.log(content);
  */
  
  //取得したjsonを整形
  const contentJSON = JSON.parse(content);

  //直近の配信台カード情報を配列で取り出す
  const matchData = getMatchData(contentJSON);
  
  //取得したjsonをスプレッドシートに入力する処理
  inputDatafromJSONtoSpreadSheet(matchData);


}

// スプレッドシートからデータを引っ張ってくる関数
function inputDatafromSpreadSheet(){
  //シート取得
  const ss = SpreadsheetApp.openById(SpreadsheetApp.getActiveSpreadsheet().getId());
  const sheetIn = ss.getSheetByName("variables");

  const variables= sheetIn.getRange(2,1,1,3).getValues();

  return variables;
}

// 取得したjsonをスプレッドシートに入力する関数
function inputDatafromJSONtoSpreadSheet(data){
  
  //シート取得
  const ss = SpreadsheetApp.openById(SpreadsheetApp.getActiveSpreadsheet().getId());
  const sheetOut = ss.getSheetByName("sources");

  sheetOut.getRange(2,1,1,7).setValues(data);
  
}



//各試合データ取得関数(引数：配信台に割り当てられている試合のインデックス)
function getMatchData(json){
  const targetelement = json.data.tournament.streamQueue.find((v) => v.stream.streamName == "eastgeeksmash");

  const fullRoundText = targetelement.sets[0].fullRoundText;
  const prefix_1 = targetelement.sets[0].slots[0].entrant.participants[0].prefix;
  const prefix_2 = targetelement.sets[0].slots[1].entrant.participants[0].prefix;
  const gamerTag_1 = targetelement.sets[0].slots[0].entrant.participants[0].gamerTag;
  const gamerTag_2 = targetelement.sets[0].slots[1].entrant.participants[0].gamerTag;
  const twitter_1 = targetelement.sets[0].slots[0].entrant.participants[0].user ? targetelement.sets[0].slots[0].entrant.participants[0].user.authorizations[0].externalUsername : null;
  const twitter_2 = targetelement.sets[0].slots[1].entrant.participants[0].user ? targetelement.sets[0].slots[1].entrant.participants[0].user.authorizations[0].externalUsername : null;
  
  // スプシsource A2:G2 にぶち込む用の配列
  const matchData = [[fullRoundText,prefix_1,gamerTag_1,twitter_1,prefix_2,gamerTag_2,twitter_2]];

  return matchData;
}
