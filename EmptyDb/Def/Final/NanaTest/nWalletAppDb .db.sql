PRAGMA encoding="UTF-8";
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "android_metadata" (
	"locale"	TEXT
);
CREATE TABLE IF NOT EXISTS "wallets" (
	"id"	INTEGER,
	"name"	TEXT,
	"balance"	REAL,
	PRIMARY KEY('id' AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "transactions" (
	"tid"	INTEGER,
	"walletId"	INTEGER,
	"type"	TEXT,
	"txAmount"	REAL,
	"txReason"	TEXT,
	"txImportance"	TEXT,
	"txDate"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"BalanceAfter"	REAL,
	PRIMARY KEY('tid' AUTOINCREMENT),
	FOREIGN KEY("walletId") REFERENCES "wallets"("id")
);
CREATE TABLE IF NOT EXISTS "TodoList" (
	"id"	INTEGER,
	"todoItem"	TEXT,
	"Type"	TEXT,
	"TxId"	INTEGER,
	"Price"	REAL,
	"State"	TEXT,
	"Importance"	INTEGER,
	PRIMARY KEY('id' AUTOINCREMENT),
	FOREIGN KEY("TxId") REFERENCES "transactions"("tid")
);
INSERT INTO "android_metadata" VALUES ('en_US');
INSERT INTO "wallets" VALUES (1,'Meeza',11400.0);
INSERT INTO "wallets" VALUES (2,'HomeWallet',5150.0);
INSERT INTO "wallets" VALUES (3,'Pocket',955.0);
INSERT INTO "TodoList" VALUES (1,'احذيه شتوي','',NULL,600.0,'Pending',5);
INSERT INTO "TodoList" VALUES (2,'كوتشيات','',NULL,400.0,'Pending',5);
INSERT INTO "TodoList" VALUES (3,'احذيه صيفي','',NULL,500.0,'Pending',2);
INSERT INTO "TodoList" VALUES (4,'شنط','',NULL,400.0,'Pending',5);
INSERT INTO "TodoList" VALUES (5,'ميكب','',NULL,1000.0,'Pending',3);
INSERT INTO "TodoList" VALUES (6,'تنكري','',NULL,700.0,'Pending',5);
INSERT INTO "TodoList" VALUES (7,'بناطيل جينز','',NULL,500.0,'Pending',5);
INSERT INTO "TodoList" VALUES (8,'هدوم شتوي','',NULL,600.0,'Pending',5);
INSERT INTO "TodoList" VALUES (9,'هدوم صيفي','',NULL,1000.0,'Pending',3);
INSERT INTO "TodoList" VALUES (10,'طرح','',NULL,300.0,'Pending',3);
INSERT INTO "TodoList" VALUES (11,'اسدالات ','',NULL,250.0,'Pending',3);
INSERT INTO "TodoList" VALUES (12,'شرابات وشباشب','',NULL,550.0,'Pending',3);
INSERT INTO "TodoList" VALUES (13,'فستان الفرح والميكب','',NULL,3000.0,'Pending',3);
INSERT INTO "TodoList" VALUES (14,'علبه اكسسوريز واكسسوريز','',NULL,500.0,'Pending',3);
INSERT INTO "TodoList" VALUES (15,'الشعر','',NULL,2000.0,'Pending',4);
INSERT INTO "TodoList" VALUES (16,'حمام مغربي وخلافه','',NULL,1000.0,'Pending',4);
INSERT INTO "TodoList" VALUES (17,'نظافه شخصيه','',NULL,500.0,'Pending',3);
INSERT INTO "TodoList" VALUES (18,'عبدالرحمن','',NULL,1000.0,'Pending',3);
INSERT INTO "TodoList" VALUES (19,'عيد الأم','',NULL,300.0,'Pending',5);
INSERT INTO "TodoList" VALUES (20,'جيم','',NULL,500.0,'Pending',5);
INSERT INTO "TodoList" VALUES (21,'براهات ','',NULL,300.0,'Pending',3);
CREATE TRIGGER txUpdate AFTER INSERT ON transactions BEGIN UPDATE wallets SET balance=(SELECT CASE WHEN transactions.type='+' THEN( wallets.balance + transactions.txAmount) ELSE (wallets.balance -transactions.txAmount) END FROM wallets,transactions  WHERE wallets.id=(SELECT transactions.walletId as wId FROM transactions ORDER by tid desc LIMIT 1 )ORDER by tid desc LIMIT 1) WHERE wallets.id= (SELECT transactions.walletId FROM transactions ORDER by tid desc LIMIT 1); END;
COMMIT;
