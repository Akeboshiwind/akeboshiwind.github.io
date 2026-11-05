// Generated from src/lib/cte/xtdb-sql/Sql.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class Sql extends antlr.Parser {
    public static readonly BLOCK_COMMENT = 1;
    public static readonly LINE_COMMENT = 2;
    public static readonly WHITESPACE = 3;
    public static readonly UNSIGNED_FLOAT = 4;
    public static readonly UNSIGNED_INTEGER = 5;
    public static readonly CHARACTER_STRING = 6;
    public static readonly C_ESCAPES_STRING = 7;
    public static readonly BINARY_STRING = 8;
    public static readonly POSTGRES_PARAMETER_SPECIFICATION = 9;
    public static readonly COMMA = 10;
    public static readonly DOT = 11;
    public static readonly SEMI = 12;
    public static readonly COLON = 13;
    public static readonly QUESTION = 14;
    public static readonly LPAREN = 15;
    public static readonly RPAREN = 16;
    public static readonly LBRACK = 17;
    public static readonly RBRACK = 18;
    public static readonly LBRACE = 19;
    public static readonly RBRACE = 20;
    public static readonly CONCAT = 21;
    public static readonly TILDE = 22;
    public static readonly AMPERSAND = 23;
    public static readonly PLUS = 24;
    public static readonly JSON_ARROW_TEXT = 25;
    public static readonly JSON_ARROW = 26;
    public static readonly MINUS = 27;
    public static readonly ASTERISK = 28;
    public static readonly SOLIDUS = 29;
    public static readonly PERCENT = 30;
    public static readonly BITWISE_OR = 31;
    public static readonly JSON_PATH_TEXT = 32;
    public static readonly JSON_PATH = 33;
    public static readonly BITWISE_XOR = 34;
    public static readonly BITWISE_SHIFT_LEFT = 35;
    public static readonly BITWISE_SHIFT_RIGHT = 36;
    public static readonly EQUAL = 37;
    public static readonly NOT_EQUAL = 38;
    public static readonly LT_GT = 39;
    public static readonly LT = 40;
    public static readonly GT = 41;
    public static readonly LE = 42;
    public static readonly GE = 43;
    public static readonly PG_CAST = 44;
    public static readonly PG_REGEX_I = 45;
    public static readonly PG_NOT_REGEX = 46;
    public static readonly PG_NOT_REGEX_I = 47;
    public static readonly ALL = 48;
    public static readonly ALTER = 49;
    public static readonly ANALYZE = 50;
    public static readonly AND = 51;
    public static readonly ANY = 52;
    public static readonly ARRAY = 53;
    public static readonly ARRAY_AGG = 54;
    public static readonly AS = 55;
    public static readonly ASC = 56;
    public static readonly ASSERT = 57;
    public static readonly ASYMMETRIC = 58;
    public static readonly ASYNC = 59;
    public static readonly AT = 60;
    public static readonly ATTACH = 61;
    public static readonly AVG = 62;
    public static readonly AWAIT_TOKEN = 63;
    public static readonly BEGIN = 64;
    public static readonly BEGIN_FRAME = 65;
    public static readonly BEGIN_PARTITION = 66;
    public static readonly BETWEEN = 67;
    public static readonly BIGINT = 68;
    public static readonly BOOL = 69;
    public static readonly BOOLEAN = 70;
    public static readonly BOOL_AND = 71;
    public static readonly BOOL_OR = 72;
    public static readonly BOTH = 73;
    public static readonly BPCHAR = 74;
    public static readonly BY = 75;
    public static readonly BYTEA = 76;
    public static readonly CASE = 77;
    public static readonly CAST = 78;
    public static readonly CENTURY = 79;
    public static readonly CHAR = 80;
    public static readonly CHARACTERISTICS = 81;
    public static readonly CHARACTERS = 82;
    public static readonly CHARACTER_LENGTH = 83;
    public static readonly CHAR_LENGTH = 84;
    public static readonly CLOCK_TIME = 85;
    public static readonly COALESCE = 86;
    public static readonly COMMIT = 87;
    public static readonly COMMITTED = 88;
    public static readonly CONTAINS = 89;
    public static readonly COPY = 90;
    public static readonly COUNT = 91;
    public static readonly CREATE = 92;
    public static readonly CROSS = 93;
    public static readonly CUME_DIST = 94;
    public static readonly CURRENT = 95;
    public static readonly CURRENT_CATALOG = 96;
    public static readonly CURRENT_DATE = 97;
    public static readonly CURRENT_ROW = 98;
    public static readonly CURRENT_SCHEMA = 99;
    public static readonly CURRENT_SCHEMAS = 100;
    public static readonly CURRENT_SETTING = 101;
    public static readonly CURRENT_TIME = 102;
    public static readonly CURRENT_TIMESTAMP = 103;
    public static readonly CURRENT_USER = 104;
    public static readonly DATABASE = 105;
    public static readonly DATE = 106;
    public static readonly DATE_BIN = 107;
    public static readonly DATE_TRUNC = 108;
    public static readonly DAY = 109;
    public static readonly DEC = 110;
    public static readonly DECADE = 111;
    public static readonly DECIMAL = 112;
    public static readonly DEFAULT = 113;
    public static readonly DELETE = 114;
    public static readonly DENSE_RANK = 115;
    public static readonly DESC = 116;
    public static readonly DETACH = 117;
    public static readonly DISCARD = 118;
    public static readonly DISTINCT = 119;
    public static readonly DOUBLE = 120;
    public static readonly DOW = 121;
    public static readonly DOY = 122;
    public static readonly DURATION = 123;
    public static readonly ELSE = 124;
    public static readonly END = 125;
    public static readonly END_FRAME = 126;
    public static readonly END_PARTITION = 127;
    public static readonly EPOCH = 128;
    public static readonly EQUALS = 129;
    public static readonly ERASE = 130;
    public static readonly ESCAPE = 131;
    public static readonly EVERY = 132;
    public static readonly EXCEPT = 133;
    public static readonly EXCLUDE = 134;
    public static readonly EXECUTE = 135;
    public static readonly EXISTS = 136;
    public static readonly EXPLAIN = 137;
    public static readonly EXTRACT = 138;
    public static readonly FALSE = 139;
    public static readonly FETCH = 140;
    public static readonly FILTER = 141;
    public static readonly FIRST = 142;
    public static readonly FIRST_VALUE = 143;
    public static readonly FLAG = 144;
    public static readonly FLOAT = 145;
    public static readonly FLOAT4 = 146;
    public static readonly FLOAT8 = 147;
    public static readonly FOLLOWING = 148;
    public static readonly FOR = 149;
    public static readonly FORMAT = 150;
    public static readonly FRAME_ROW = 151;
    public static readonly FROM = 152;
    public static readonly FULL = 153;
    public static readonly GENERATE_SERIES = 154;
    public static readonly GRANT = 155;
    public static readonly GROUP = 156;
    public static readonly GROUPS = 157;
    public static readonly HAS_ANY_COLUMN_PRIVILEGE = 158;
    public static readonly HAS_SCHEMA_PRIVILEGE = 159;
    public static readonly HAS_TABLE_PRIVILEGE = 160;
    public static readonly HAVING = 161;
    public static readonly HOUR = 162;
    public static readonly IGNORE = 163;
    public static readonly IMMEDIATELY = 164;
    public static readonly IN = 165;
    public static readonly INNER = 166;
    public static readonly INSERT = 167;
    public static readonly INT = 168;
    public static readonly INT2 = 169;
    public static readonly INT4 = 170;
    public static readonly INT8 = 171;
    public static readonly INTEGER = 172;
    public static readonly INTERSECT = 173;
    public static readonly INTERVAL = 174;
    public static readonly INTO = 175;
    public static readonly IS = 176;
    public static readonly ISOLATION = 177;
    public static readonly ISODOW = 178;
    public static readonly JOIN = 179;
    public static readonly KEYWORD = 180;
    public static readonly LAG = 181;
    public static readonly LAGS = 182;
    public static readonly LAST = 183;
    public static readonly LAST_VALUE = 184;
    public static readonly LATERAL = 185;
    public static readonly LEAD = 186;
    public static readonly LEADS = 187;
    public static readonly LEADING = 188;
    public static readonly LEFT = 189;
    public static readonly LEVEL = 190;
    public static readonly ILIKE = 191;
    public static readonly LIKE = 192;
    public static readonly LIKE_REGEX = 193;
    public static readonly LIMIT = 194;
    public static readonly LOCAL = 195;
    public static readonly LOCAL_DATE = 196;
    public static readonly LOCAL_TIME = 197;
    public static readonly LOCAL_TIMESTAMP = 198;
    public static readonly MATERIALIZED = 199;
    public static readonly MAX = 200;
    public static readonly METADATA = 201;
    public static readonly MICROSECOND = 202;
    public static readonly MILLENNIUM = 203;
    public static readonly MILLISECOND = 204;
    public static readonly MIN = 205;
    public static readonly MINUTE = 206;
    public static readonly MONTH = 207;
    public static readonly NAME = 208;
    public static readonly NANOSECOND = 209;
    public static readonly NATURAL = 210;
    public static readonly NEST_MANY = 211;
    public static readonly NEST_ONE = 212;
    public static readonly NEXT = 213;
    public static readonly NO = 214;
    public static readonly NONE = 215;
    public static readonly NOT = 216;
    public static readonly NOW = 217;
    public static readonly NTH_VALUE = 218;
    public static readonly NTILE = 219;
    public static readonly NULL = 220;
    public static readonly NULLIF = 221;
    public static readonly NULLS = 222;
    public static readonly NUMERIC = 223;
    public static readonly OBJECT = 224;
    public static readonly OCTETS = 225;
    public static readonly OF = 226;
    public static readonly OFF = 227;
    public static readonly OFFSET = 228;
    public static readonly OID = 229;
    public static readonly ON = 230;
    public static readonly ONLY = 231;
    public static readonly OR = 232;
    public static readonly ORDER = 233;
    public static readonly ORDINALITY = 234;
    public static readonly OTHERS = 235;
    public static readonly OUTER = 236;
    public static readonly OVER = 237;
    public static readonly OVERLAPS = 238;
    public static readonly OVERLAY = 239;
    public static readonly PARTITION = 240;
    public static readonly PASSWORD = 241;
    public static readonly PATCH = 242;
    public static readonly PERCENT_RANK = 243;
    public static readonly PERIOD = 244;
    public static readonly PG_EXPANDARRAY = 245;
    public static readonly PG_GET_EXPR = 246;
    public static readonly PG_GET_INDEXDEF = 247;
    public static readonly PG_GET_USERBYID = 248;
    public static readonly PG_SLEEP = 249;
    public static readonly PG_SLEEP_FOR = 250;
    public static readonly PG_TABLE_IS_VISIBLE = 251;
    public static readonly PLACING = 252;
    public static readonly PLANS = 253;
    public static readonly PORTION = 254;
    public static readonly POSITION = 255;
    public static readonly PRECEDES = 256;
    public static readonly PRECEDING = 257;
    public static readonly PERCENTILE_CONT = 258;
    public static readonly PERCENTILE_DISC = 259;
    public static readonly PRECISION = 260;
    public static readonly PREPARE = 261;
    public static readonly QUARTER = 262;
    public static readonly RANGE = 263;
    public static readonly RANGE_BINS = 264;
    public static readonly RANK = 265;
    public static readonly READ = 266;
    public static readonly REAL = 267;
    public static readonly RECORD = 268;
    public static readonly RECORDS = 269;
    public static readonly RECURSIVE = 270;
    public static readonly REGCLASS = 271;
    public static readonly REGEXP_REPLACE = 272;
    public static readonly REGPROC = 273;
    public static readonly RENAME = 274;
    public static readonly REPEATABLE = 275;
    public static readonly REPLACE = 276;
    public static readonly RESPECT = 277;
    public static readonly RETURNING = 278;
    public static readonly REVOKE = 279;
    public static readonly RIGHT = 280;
    public static readonly ROLE = 281;
    public static readonly ROLLBACK = 282;
    public static readonly ROW = 283;
    public static readonly ROWS = 284;
    public static readonly ROW_NUMBER = 285;
    public static readonly SECOND = 286;
    public static readonly SELECT = 287;
    public static readonly SEQUENCES = 288;
    public static readonly SERIALIZABLE = 289;
    public static readonly SESSION = 290;
    public static readonly SET = 291;
    public static readonly SETTING = 292;
    public static readonly SHOW = 293;
    public static readonly SMALLINT = 294;
    public static readonly SNAPSHOT_TIME = 295;
    public static readonly SNAPSHOT_TOKEN = 296;
    public static readonly SOME = 297;
    public static readonly START = 298;
    public static readonly STDDEV_POP = 299;
    public static readonly STDDEV_SAMP = 300;
    public static readonly STDIN = 301;
    public static readonly STRICTLY = 302;
    public static readonly SUBSTRING = 303;
    public static readonly SUCCEEDS = 304;
    public static readonly SUM = 305;
    public static readonly SYMMETRIC = 306;
    public static readonly SYNC = 307;
    public static readonly SYSTEM_TIME = 308;
    public static readonly TABLE = 309;
    public static readonly TEMP = 310;
    public static readonly TEMPORARY = 311;
    public static readonly TEXT = 312;
    public static readonly THEN = 313;
    public static readonly TIES = 314;
    public static readonly TIME = 315;
    public static readonly TIMESTAMP = 316;
    public static readonly TIMESTAMPTZ = 317;
    public static readonly TIMEZONE = 318;
    public static readonly TIMEZONE_HOUR = 319;
    public static readonly TIMEZONE_MINUTE = 320;
    public static readonly TO = 321;
    public static readonly TRAILING = 322;
    public static readonly TRANSACTION = 323;
    public static readonly TRIM = 324;
    public static readonly TRIM_ARRAY = 325;
    public static readonly TRUE = 326;
    public static readonly TSTZRANGE = 327;
    public static readonly UNBOUNDED = 328;
    public static readonly UNCOMMITTED = 329;
    public static readonly UNION = 330;
    public static readonly UNKNOWN = 331;
    public static readonly UNNEST = 332;
    public static readonly UPDATE = 333;
    public static readonly URI = 334;
    public static readonly URI_FRAGMENT = 335;
    public static readonly URI_HOST = 336;
    public static readonly URI_PATH = 337;
    public static readonly URI_PORT = 338;
    public static readonly URI_QUERY = 339;
    public static readonly URI_SCHEME = 340;
    public static readonly URI_USER_INFO = 341;
    public static readonly USER = 342;
    public static readonly USING = 343;
    public static readonly UUID = 344;
    public static readonly VALID_TIME = 345;
    public static readonly VALUES = 346;
    public static readonly VALUE_OF = 347;
    public static readonly VARCHAR = 348;
    public static readonly VAR_POP = 349;
    public static readonly VAR_SAMP = 350;
    public static readonly VARBINARY = 351;
    public static readonly VERSION = 352;
    public static readonly WEEK = 353;
    public static readonly WHEN = 354;
    public static readonly WHERE = 355;
    public static readonly WINDOW = 356;
    public static readonly WITHIN = 357;
    public static readonly WITH = 358;
    public static readonly WITHOUT = 359;
    public static readonly WRITE = 360;
    public static readonly XTQL = 361;
    public static readonly YEAR = 362;
    public static readonly ZONE = 363;
    public static readonly DOLLAR_TAG = 364;
    public static readonly REGULAR_IDENTIFIER = 365;
    public static readonly DELIMITED_IDENTIFIER = 366;
    public static readonly DM_END_TAG = 367;
    public static readonly DM_TEXT = 368;
    public static readonly RULE_directSqlStatement = 0;
    public static readonly RULE_multiSqlStatement = 1;
    public static readonly RULE_directlyExecutableStatement = 2;
    public static readonly RULE_discardTarget = 3;
    public static readonly RULE_targetTable = 4;
    public static readonly RULE_executeArgs = 5;
    public static readonly RULE_copyOpts = 6;
    public static readonly RULE_copyOpt = 7;
    public static readonly RULE_showVariable = 8;
    public static readonly RULE_settingQueryVariables = 9;
    public static readonly RULE_settingQueryVariable = 10;
    public static readonly RULE_intervalLiteral = 11;
    public static readonly RULE_dateTimeLiteral = 12;
    public static readonly RULE_integerLiteral = 13;
    public static readonly RULE_literal = 14;
    public static readonly RULE_dollarStringText = 15;
    public static readonly RULE_characterString = 16;
    public static readonly RULE_intervalQualifier = 17;
    public static readonly RULE_intervalFractionalSecondsPrecision = 18;
    public static readonly RULE_nonSecondPrimaryDatetimeField = 19;
    public static readonly RULE_singleDatetimeField = 20;
    public static readonly RULE_identifierChain = 21;
    public static readonly RULE_identifier = 22;
    public static readonly RULE_nonReservedKeyword = 23;
    public static readonly RULE_columnName = 24;
    public static readonly RULE_columnLabel = 25;
    public static readonly RULE_dataType = 26;
    public static readonly RULE_precision = 27;
    public static readonly RULE_scale = 28;
    public static readonly RULE_charLengthUnits = 29;
    public static readonly RULE_withOrWithoutTimeZone = 30;
    public static readonly RULE_maximumCardinality = 31;
    public static readonly RULE_fieldDefinition = 32;
    public static readonly RULE_expr = 33;
    public static readonly RULE_commonValueExpr = 34;
    public static readonly RULE_currentInstantFunction = 35;
    public static readonly RULE_booleanValue = 36;
    public static readonly RULE_objectConstructor = 37;
    public static readonly RULE_objectNameAndValue = 38;
    public static readonly RULE_parameterSpecification = 39;
    public static readonly RULE_staticExpr = 40;
    public static readonly RULE_columnReference = 41;
    public static readonly RULE_generateSeries = 42;
    public static readonly RULE_windowFunctionType = 43;
    public static readonly RULE_rankFunctionType = 44;
    public static readonly RULE_numberOfTiles = 45;
    public static readonly RULE_nullTreatment = 46;
    public static readonly RULE_firstOrLastValue = 47;
    public static readonly RULE_nthRow = 48;
    public static readonly RULE_fromFirstOrLast = 49;
    public static readonly RULE_windowNameOrSpecification = 50;
    public static readonly RULE_nestedWindowFunction = 51;
    public static readonly RULE_rowMarker = 52;
    public static readonly RULE_rowMarkerExpression = 53;
    public static readonly RULE_rowMarkerDelta = 54;
    public static readonly RULE_rowMarkerOffset = 55;
    public static readonly RULE_valueOfDefaultValue = 56;
    public static readonly RULE_simpleWhenClause = 57;
    public static readonly RULE_searchedWhenClause = 58;
    public static readonly RULE_elseClause = 59;
    public static readonly RULE_whenOperandList = 60;
    public static readonly RULE_whenOperand = 61;
    public static readonly RULE_extractField = 62;
    public static readonly RULE_primaryDatetimeField = 63;
    public static readonly RULE_timeZoneField = 64;
    public static readonly RULE_pgExtractField = 65;
    public static readonly RULE_trimSpecification = 66;
    public static readonly RULE_dateTruncPrecision = 67;
    public static readonly RULE_arrayValueConstructor = 68;
    public static readonly RULE_rowValueConstructor = 69;
    public static readonly RULE_rowValueList = 70;
    public static readonly RULE_tableValueConstructor = 71;
    public static readonly RULE_recordValueConstructor = 72;
    public static readonly RULE_recordsValueList = 73;
    public static readonly RULE_recordsValueConstructor = 74;
    public static readonly RULE_fromClause = 75;
    public static readonly RULE_tableReference = 76;
    public static readonly RULE_withOrdinality = 77;
    public static readonly RULE_tableAlias = 78;
    public static readonly RULE_tableProjection = 79;
    public static readonly RULE_querySystemTimePeriodSpecification = 80;
    public static readonly RULE_queryValidTimePeriodSpecification = 81;
    public static readonly RULE_tableTimePeriodSpecification = 82;
    public static readonly RULE_fromTableRef = 83;
    public static readonly RULE_columnNameList = 84;
    public static readonly RULE_joinSpecification = 85;
    public static readonly RULE_joinType = 86;
    public static readonly RULE_outerJoinType = 87;
    public static readonly RULE_whereClause = 88;
    public static readonly RULE_groupByClause = 89;
    public static readonly RULE_groupingElement = 90;
    public static readonly RULE_havingClause = 91;
    public static readonly RULE_windowClause = 92;
    public static readonly RULE_windowDefinitionList = 93;
    public static readonly RULE_windowDefinition = 94;
    public static readonly RULE_newWindowName = 95;
    public static readonly RULE_windowSpecification = 96;
    public static readonly RULE_windowSpecificationDetails = 97;
    public static readonly RULE_windowPartitionClause = 98;
    public static readonly RULE_windowPartitionColumnReferenceList = 99;
    public static readonly RULE_windowOrderClause = 100;
    public static readonly RULE_windowFrameClause = 101;
    public static readonly RULE_windowFrameUnits = 102;
    public static readonly RULE_windowFrameExtent = 103;
    public static readonly RULE_windowFrameStart = 104;
    public static readonly RULE_windowFramePreceding = 105;
    public static readonly RULE_windowFrameBetween = 106;
    public static readonly RULE_windowFrameBound = 107;
    public static readonly RULE_windowFrameFollowing = 108;
    public static readonly RULE_windowFrameExclusion = 109;
    public static readonly RULE_selectClause = 110;
    public static readonly RULE_selectList = 111;
    public static readonly RULE_selectListAsterisk = 112;
    public static readonly RULE_selectSublist = 113;
    public static readonly RULE_qualifiedAsterisk = 114;
    public static readonly RULE_renameClause = 115;
    public static readonly RULE_renameColumn = 116;
    public static readonly RULE_qualifiedRenameClause = 117;
    public static readonly RULE_qualifiedRenameColumn = 118;
    public static readonly RULE_excludeClause = 119;
    public static readonly RULE_derivedColumn = 120;
    public static readonly RULE_asClause = 121;
    public static readonly RULE_queryExpression = 122;
    public static readonly RULE_queryExpressionNoWith = 123;
    public static readonly RULE_withClause = 124;
    public static readonly RULE_withListElement = 125;
    public static readonly RULE_queryExpressionBody = 126;
    public static readonly RULE_xtqlParams = 127;
    public static readonly RULE_queryTail = 128;
    public static readonly RULE_orderByClause = 129;
    public static readonly RULE_offsetAndLimit = 130;
    public static readonly RULE_resultOffsetClause = 131;
    public static readonly RULE_fetchFirstClause = 132;
    public static readonly RULE_offsetRowCount = 133;
    public static readonly RULE_fetchFirstRowCount = 134;
    public static readonly RULE_subquery = 135;
    public static readonly RULE_predicatePart2 = 136;
    public static readonly RULE_quantifiedComparisonPredicatePart3 = 137;
    public static readonly RULE_compOp = 138;
    public static readonly RULE_inPredicateValue = 139;
    public static readonly RULE_postgresRegexOperator = 140;
    public static readonly RULE_quantifier = 141;
    public static readonly RULE_searchCondition = 142;
    public static readonly RULE_aggregateFunction = 143;
    public static readonly RULE_aggregateFilterClause = 144;
    public static readonly RULE_percentileFraction = 145;
    public static readonly RULE_orderedSetFunctionType = 146;
    public static readonly RULE_setFunctionType = 147;
    public static readonly RULE_setQuantifier = 148;
    public static readonly RULE_sortSpecificationList = 149;
    public static readonly RULE_sortSpecification = 150;
    public static readonly RULE_orderingSpecification = 151;
    public static readonly RULE_nullOrdering = 152;
    public static readonly RULE_returningStatement = 153;
    public static readonly RULE_dmlStatementValidTimeExtents = 154;
    public static readonly RULE_patchStatementValidTimeExtents = 155;
    public static readonly RULE_patchSource = 156;
    public static readonly RULE_insertColumnsAndSource = 157;
    public static readonly RULE_setClauseList = 158;
    public static readonly RULE_setClause = 159;
    public static readonly RULE_setTarget = 160;
    public static readonly RULE_sessionCharacteristic = 161;
    public static readonly RULE_sessionTxMode = 162;
    public static readonly RULE_transactionCharacteristics = 163;
    public static readonly RULE_commonTxMode = 164;
    public static readonly RULE_readOnlyTxMode = 165;
    public static readonly RULE_readWriteTxMode = 166;
    public static readonly RULE_beginWithCharacteristics = 167;
    public static readonly RULE_beginWithMode = 168;
    public static readonly RULE_beginReadOnlyOption = 169;
    public static readonly RULE_beginReadWriteOption = 170;
    public static readonly RULE_txOptionValue = 171;
    public static readonly RULE_txTzOption = 172;
    public static readonly RULE_readOnlyTxOption = 173;
    public static readonly RULE_readWriteTxOption = 174;
    public static readonly RULE_levelOfIsolation = 175;

    public static readonly literalNames = [
        null, null, null, null, null, null, null, null, null, null, "','", 
        "'.'", "';'", "':'", "'?'", "'('", "')'", "'['", "']'", "'{'", "'}'", 
        "'||'", "'~'", "'&'", "'+'", "'->>'", "'->'", "'-'", "'*'", "'/'", 
        "'%'", "'|'", "'#>>'", "'#>'", "'#'", "'<<'", "'>>'", "'='", "'!='", 
        "'<>'", "'<'", "'>'", "'<='", "'>='", "'::'", "'~*'", "'!~'", "'!~*'", 
        "'ALL'", "'ALTER'", null, "'AND'", "'ANY'", "'ARRAY'", "'ARRAY_AGG'", 
        "'AS'", "'ASC'", "'ASSERT'", "'ASYMMETRIC'", "'ASYNC'", "'AT'", 
        "'ATTACH'", "'AVG'", "'AWAIT_TOKEN'", "'BEGIN'", "'BEGIN_FRAME'", 
        "'BEGIN_PARTITION'", "'BETWEEN'", "'BIGINT'", "'BOOL'", "'BOOLEAN'", 
        "'BOOL_AND'", "'BOOL_OR'", "'BOTH'", "'BPCHAR'", "'BY'", "'BYTEA'", 
        "'CASE'", "'CAST'", "'CENTURY'", "'CHAR'", "'CHARACTERISTICS'", 
        "'CHARACTERS'", "'CHARACTER_LENGTH'", "'CHAR_LENGTH'", "'CLOCK_TIME'", 
        "'COALESCE'", "'COMMIT'", "'COMMITTED'", "'CONTAINS'", "'COPY'", 
        "'COUNT'", "'CREATE'", "'CROSS'", "'CUME_DIST'", "'CURRENT'", "'CURRENT_CATALOG'", 
        "'CURRENT_DATE'", "'CURRENT_ROW'", "'CURRENT_SCHEMA'", "'CURRENT_SCHEMAS'", 
        "'CURRENT_SETTING'", "'CURRENT_TIME'", "'CURRENT_TIMESTAMP'", "'CURRENT_USER'", 
        "'DATABASE'", "'DATE'", "'DATE_BIN'", "'DATE_TRUNC'", "'DAY'", "'DEC'", 
        "'DECADE'", "'DECIMAL'", "'DEFAULT'", "'DELETE'", "'DENSE_RANK'", 
        "'DESC'", "'DETACH'", "'DISCARD'", "'DISTINCT'", "'DOUBLE'", "'DOW'", 
        "'DOY'", "'DURATION'", "'ELSE'", "'END'", "'END_FRAME'", "'END_PARTITION'", 
        "'EPOCH'", "'EQUALS'", "'ERASE'", "'ESCAPE'", "'EVERY'", "'EXCEPT'", 
        "'EXCLUDE'", "'EXECUTE'", "'EXISTS'", "'EXPLAIN'", "'EXTRACT'", 
        "'FALSE'", "'FETCH'", "'FILTER'", "'FIRST'", "'FIRST_VALUE'", "'FLAG'", 
        "'FLOAT'", "'FLOAT4'", "'FLOAT8'", "'FOLLOWING'", "'FOR'", "'FORMAT'", 
        "'FRAME_ROW'", "'FROM'", "'FULL'", "'GENERATE_SERIES'", "'GRANT'", 
        "'GROUP'", "'GROUPS'", "'HAS_ANY_COLUMN_PRIVILEGE'", "'HAS_SCHEMA_PRIVILEGE'", 
        "'HAS_TABLE_PRIVILEGE'", "'HAVING'", "'HOUR'", "'IGNORE'", "'IMMEDIATELY'", 
        "'IN'", "'INNER'", "'INSERT'", "'INT'", "'INT2'", "'INT4'", "'INT8'", 
        "'INTEGER'", "'INTERSECT'", "'INTERVAL'", "'INTO'", "'IS'", "'ISOLATION'", 
        "'ISODOW'", "'JOIN'", "'KEYWORD'", "'LAG'", "'LAGS'", "'LAST'", 
        "'LAST_VALUE'", "'LATERAL'", "'LEAD'", "'LEADS'", "'LEADING'", "'LEFT'", 
        "'LEVEL'", "'ILIKE'", "'LIKE'", "'LIKE_REGEX'", "'LIMIT'", "'LOCAL'", 
        null, null, null, "'MATERIALIZED'", "'MAX'", "'METADATA'", "'MICROSECOND'", 
        "'MILLENNIUM'", "'MILLISECOND'", "'MIN'", "'MINUTE'", "'MONTH'", 
        "'NAME'", "'NANOSECOND'", "'NATURAL'", "'NEST_MANY'", "'NEST_ONE'", 
        "'NEXT'", "'NO'", "'NONE'", "'NOT'", "'NOW'", "'NTH_VALUE'", "'NTILE'", 
        "'NULL'", "'NULLIF'", "'NULLS'", "'NUMERIC'", "'OBJECT'", "'OCTETS'", 
        "'OF'", "'OFF'", "'OFFSET'", "'OID'", "'ON'", "'ONLY'", "'OR'", 
        "'ORDER'", "'ORDINALITY'", "'OTHERS'", "'OUTER'", "'OVER'", "'OVERLAPS'", 
        "'OVERLAY'", "'PARTITION'", "'PASSWORD'", "'PATCH'", "'PERCENT_RANK'", 
        "'PERIOD'", "'_PG_EXPANDARRAY'", "'PG_GET_EXPR'", "'PG_GET_INDEXDEF'", 
        "'PG_GET_USERBYID'", "'PG_SLEEP'", "'PG_SLEEP_FOR'", "'PG_TABLE_IS_VISIBLE'", 
        "'PLACING'", "'PLANS'", "'PORTION'", "'POSITION'", "'PRECEDES'", 
        "'PRECEDING'", "'PERCENTILE_CONT'", "'PERCENTILE_DISC'", "'PRECISION'", 
        "'PREPARE'", "'QUARTER'", "'RANGE'", "'RANGE_BINS'", "'RANK'", "'READ'", 
        "'REAL'", "'RECORD'", "'RECORDS'", "'RECURSIVE'", "'REGCLASS'", 
        "'REGEXP_REPLACE'", "'REGPROC'", "'RENAME'", "'REPEATABLE'", "'REPLACE'", 
        "'RESPECT'", "'RETURNING'", "'REVOKE'", "'RIGHT'", "'ROLE'", "'ROLLBACK'", 
        "'ROW'", "'ROWS'", "'ROW_NUMBER'", "'SECOND'", "'SELECT'", "'SEQUENCES'", 
        "'SERIALIZABLE'", "'SESSION'", "'SET'", "'SETTING'", "'SHOW'", "'SMALLINT'", 
        "'SNAPSHOT_TIME'", "'SNAPSHOT_TOKEN'", "'SOME'", "'START'", "'STDDEV_POP'", 
        "'STDDEV_SAMP'", "'STDIN'", "'STRICTLY'", "'SUBSTRING'", "'SUCCEEDS'", 
        "'SUM'", "'SYMMETRIC'", "'SYNC'", "'SYSTEM_TIME'", "'TABLE'", "'TEMP'", 
        "'TEMPORARY'", "'TEXT'", "'THEN'", "'TIES'", "'TIME'", "'TIMESTAMP'", 
        "'TIMESTAMPTZ'", "'TIMEZONE'", "'TIMEZONE_HOUR'", "'TIMEZONE_MINUTE'", 
        "'TO'", "'TRAILING'", "'TRANSACTION'", "'TRIM'", "'TRIM_ARRAY'", 
        "'TRUE'", "'TSTZRANGE'", "'UNBOUNDED'", "'UNCOMMITTED'", "'UNION'", 
        "'UNKNOWN'", "'UNNEST'", "'UPDATE'", "'URI'", "'URI_FRAGMENT'", 
        "'URI_HOST'", "'URI_PATH'", "'URI_PORT'", "'URI_QUERY'", "'URI_SCHEME'", 
        "'URI_USER_INFO'", "'USER'", "'USING'", "'UUID'", "'VALID_TIME'", 
        "'VALUES'", "'VALUE_OF'", "'VARCHAR'", "'VAR_POP'", "'VAR_SAMP'", 
        "'VARBINARY'", "'VERSION'", "'WEEK'", "'WHEN'", "'WHERE'", "'WINDOW'", 
        "'WITHIN'", "'WITH'", "'WITHOUT'", "'WRITE'", "'XTQL'", "'YEAR'", 
        "'ZONE'"
    ];

    public static readonly symbolicNames = [
        null, "BLOCK_COMMENT", "LINE_COMMENT", "WHITESPACE", "UNSIGNED_FLOAT", 
        "UNSIGNED_INTEGER", "CHARACTER_STRING", "C_ESCAPES_STRING", "BINARY_STRING", 
        "POSTGRES_PARAMETER_SPECIFICATION", "COMMA", "DOT", "SEMI", "COLON", 
        "QUESTION", "LPAREN", "RPAREN", "LBRACK", "RBRACK", "LBRACE", "RBRACE", 
        "CONCAT", "TILDE", "AMPERSAND", "PLUS", "JSON_ARROW_TEXT", "JSON_ARROW", 
        "MINUS", "ASTERISK", "SOLIDUS", "PERCENT", "BITWISE_OR", "JSON_PATH_TEXT", 
        "JSON_PATH", "BITWISE_XOR", "BITWISE_SHIFT_LEFT", "BITWISE_SHIFT_RIGHT", 
        "EQUAL", "NOT_EQUAL", "LT_GT", "LT", "GT", "LE", "GE", "PG_CAST", 
        "PG_REGEX_I", "PG_NOT_REGEX", "PG_NOT_REGEX_I", "ALL", "ALTER", 
        "ANALYZE", "AND", "ANY", "ARRAY", "ARRAY_AGG", "AS", "ASC", "ASSERT", 
        "ASYMMETRIC", "ASYNC", "AT", "ATTACH", "AVG", "AWAIT_TOKEN", "BEGIN", 
        "BEGIN_FRAME", "BEGIN_PARTITION", "BETWEEN", "BIGINT", "BOOL", "BOOLEAN", 
        "BOOL_AND", "BOOL_OR", "BOTH", "BPCHAR", "BY", "BYTEA", "CASE", 
        "CAST", "CENTURY", "CHAR", "CHARACTERISTICS", "CHARACTERS", "CHARACTER_LENGTH", 
        "CHAR_LENGTH", "CLOCK_TIME", "COALESCE", "COMMIT", "COMMITTED", 
        "CONTAINS", "COPY", "COUNT", "CREATE", "CROSS", "CUME_DIST", "CURRENT", 
        "CURRENT_CATALOG", "CURRENT_DATE", "CURRENT_ROW", "CURRENT_SCHEMA", 
        "CURRENT_SCHEMAS", "CURRENT_SETTING", "CURRENT_TIME", "CURRENT_TIMESTAMP", 
        "CURRENT_USER", "DATABASE", "DATE", "DATE_BIN", "DATE_TRUNC", "DAY", 
        "DEC", "DECADE", "DECIMAL", "DEFAULT", "DELETE", "DENSE_RANK", "DESC", 
        "DETACH", "DISCARD", "DISTINCT", "DOUBLE", "DOW", "DOY", "DURATION", 
        "ELSE", "END", "END_FRAME", "END_PARTITION", "EPOCH", "EQUALS", 
        "ERASE", "ESCAPE", "EVERY", "EXCEPT", "EXCLUDE", "EXECUTE", "EXISTS", 
        "EXPLAIN", "EXTRACT", "FALSE", "FETCH", "FILTER", "FIRST", "FIRST_VALUE", 
        "FLAG", "FLOAT", "FLOAT4", "FLOAT8", "FOLLOWING", "FOR", "FORMAT", 
        "FRAME_ROW", "FROM", "FULL", "GENERATE_SERIES", "GRANT", "GROUP", 
        "GROUPS", "HAS_ANY_COLUMN_PRIVILEGE", "HAS_SCHEMA_PRIVILEGE", "HAS_TABLE_PRIVILEGE", 
        "HAVING", "HOUR", "IGNORE", "IMMEDIATELY", "IN", "INNER", "INSERT", 
        "INT", "INT2", "INT4", "INT8", "INTEGER", "INTERSECT", "INTERVAL", 
        "INTO", "IS", "ISOLATION", "ISODOW", "JOIN", "KEYWORD", "LAG", "LAGS", 
        "LAST", "LAST_VALUE", "LATERAL", "LEAD", "LEADS", "LEADING", "LEFT", 
        "LEVEL", "ILIKE", "LIKE", "LIKE_REGEX", "LIMIT", "LOCAL", "LOCAL_DATE", 
        "LOCAL_TIME", "LOCAL_TIMESTAMP", "MATERIALIZED", "MAX", "METADATA", 
        "MICROSECOND", "MILLENNIUM", "MILLISECOND", "MIN", "MINUTE", "MONTH", 
        "NAME", "NANOSECOND", "NATURAL", "NEST_MANY", "NEST_ONE", "NEXT", 
        "NO", "NONE", "NOT", "NOW", "NTH_VALUE", "NTILE", "NULL", "NULLIF", 
        "NULLS", "NUMERIC", "OBJECT", "OCTETS", "OF", "OFF", "OFFSET", "OID", 
        "ON", "ONLY", "OR", "ORDER", "ORDINALITY", "OTHERS", "OUTER", "OVER", 
        "OVERLAPS", "OVERLAY", "PARTITION", "PASSWORD", "PATCH", "PERCENT_RANK", 
        "PERIOD", "PG_EXPANDARRAY", "PG_GET_EXPR", "PG_GET_INDEXDEF", "PG_GET_USERBYID", 
        "PG_SLEEP", "PG_SLEEP_FOR", "PG_TABLE_IS_VISIBLE", "PLACING", "PLANS", 
        "PORTION", "POSITION", "PRECEDES", "PRECEDING", "PERCENTILE_CONT", 
        "PERCENTILE_DISC", "PRECISION", "PREPARE", "QUARTER", "RANGE", "RANGE_BINS", 
        "RANK", "READ", "REAL", "RECORD", "RECORDS", "RECURSIVE", "REGCLASS", 
        "REGEXP_REPLACE", "REGPROC", "RENAME", "REPEATABLE", "REPLACE", 
        "RESPECT", "RETURNING", "REVOKE", "RIGHT", "ROLE", "ROLLBACK", "ROW", 
        "ROWS", "ROW_NUMBER", "SECOND", "SELECT", "SEQUENCES", "SERIALIZABLE", 
        "SESSION", "SET", "SETTING", "SHOW", "SMALLINT", "SNAPSHOT_TIME", 
        "SNAPSHOT_TOKEN", "SOME", "START", "STDDEV_POP", "STDDEV_SAMP", 
        "STDIN", "STRICTLY", "SUBSTRING", "SUCCEEDS", "SUM", "SYMMETRIC", 
        "SYNC", "SYSTEM_TIME", "TABLE", "TEMP", "TEMPORARY", "TEXT", "THEN", 
        "TIES", "TIME", "TIMESTAMP", "TIMESTAMPTZ", "TIMEZONE", "TIMEZONE_HOUR", 
        "TIMEZONE_MINUTE", "TO", "TRAILING", "TRANSACTION", "TRIM", "TRIM_ARRAY", 
        "TRUE", "TSTZRANGE", "UNBOUNDED", "UNCOMMITTED", "UNION", "UNKNOWN", 
        "UNNEST", "UPDATE", "URI", "URI_FRAGMENT", "URI_HOST", "URI_PATH", 
        "URI_PORT", "URI_QUERY", "URI_SCHEME", "URI_USER_INFO", "USER", 
        "USING", "UUID", "VALID_TIME", "VALUES", "VALUE_OF", "VARCHAR", 
        "VAR_POP", "VAR_SAMP", "VARBINARY", "VERSION", "WEEK", "WHEN", "WHERE", 
        "WINDOW", "WITHIN", "WITH", "WITHOUT", "WRITE", "XTQL", "YEAR", 
        "ZONE", "DOLLAR_TAG", "REGULAR_IDENTIFIER", "DELIMITED_IDENTIFIER", 
        "DM_END_TAG", "DM_TEXT"
    ];
    public static readonly ruleNames = [
        "directSqlStatement", "multiSqlStatement", "directlyExecutableStatement", 
        "discardTarget", "targetTable", "executeArgs", "copyOpts", "copyOpt", 
        "showVariable", "settingQueryVariables", "settingQueryVariable", 
        "intervalLiteral", "dateTimeLiteral", "integerLiteral", "literal", 
        "dollarStringText", "characterString", "intervalQualifier", "intervalFractionalSecondsPrecision", 
        "nonSecondPrimaryDatetimeField", "singleDatetimeField", "identifierChain", 
        "identifier", "nonReservedKeyword", "columnName", "columnLabel", 
        "dataType", "precision", "scale", "charLengthUnits", "withOrWithoutTimeZone", 
        "maximumCardinality", "fieldDefinition", "expr", "commonValueExpr", 
        "currentInstantFunction", "booleanValue", "objectConstructor", "objectNameAndValue", 
        "parameterSpecification", "staticExpr", "columnReference", "generateSeries", 
        "windowFunctionType", "rankFunctionType", "numberOfTiles", "nullTreatment", 
        "firstOrLastValue", "nthRow", "fromFirstOrLast", "windowNameOrSpecification", 
        "nestedWindowFunction", "rowMarker", "rowMarkerExpression", "rowMarkerDelta", 
        "rowMarkerOffset", "valueOfDefaultValue", "simpleWhenClause", "searchedWhenClause", 
        "elseClause", "whenOperandList", "whenOperand", "extractField", 
        "primaryDatetimeField", "timeZoneField", "pgExtractField", "trimSpecification", 
        "dateTruncPrecision", "arrayValueConstructor", "rowValueConstructor", 
        "rowValueList", "tableValueConstructor", "recordValueConstructor", 
        "recordsValueList", "recordsValueConstructor", "fromClause", "tableReference", 
        "withOrdinality", "tableAlias", "tableProjection", "querySystemTimePeriodSpecification", 
        "queryValidTimePeriodSpecification", "tableTimePeriodSpecification", 
        "fromTableRef", "columnNameList", "joinSpecification", "joinType", 
        "outerJoinType", "whereClause", "groupByClause", "groupingElement", 
        "havingClause", "windowClause", "windowDefinitionList", "windowDefinition", 
        "newWindowName", "windowSpecification", "windowSpecificationDetails", 
        "windowPartitionClause", "windowPartitionColumnReferenceList", "windowOrderClause", 
        "windowFrameClause", "windowFrameUnits", "windowFrameExtent", "windowFrameStart", 
        "windowFramePreceding", "windowFrameBetween", "windowFrameBound", 
        "windowFrameFollowing", "windowFrameExclusion", "selectClause", 
        "selectList", "selectListAsterisk", "selectSublist", "qualifiedAsterisk", 
        "renameClause", "renameColumn", "qualifiedRenameClause", "qualifiedRenameColumn", 
        "excludeClause", "derivedColumn", "asClause", "queryExpression", 
        "queryExpressionNoWith", "withClause", "withListElement", "queryExpressionBody", 
        "xtqlParams", "queryTail", "orderByClause", "offsetAndLimit", "resultOffsetClause", 
        "fetchFirstClause", "offsetRowCount", "fetchFirstRowCount", "subquery", 
        "predicatePart2", "quantifiedComparisonPredicatePart3", "compOp", 
        "inPredicateValue", "postgresRegexOperator", "quantifier", "searchCondition", 
        "aggregateFunction", "aggregateFilterClause", "percentileFraction", 
        "orderedSetFunctionType", "setFunctionType", "setQuantifier", "sortSpecificationList", 
        "sortSpecification", "orderingSpecification", "nullOrdering", "returningStatement", 
        "dmlStatementValidTimeExtents", "patchStatementValidTimeExtents", 
        "patchSource", "insertColumnsAndSource", "setClauseList", "setClause", 
        "setTarget", "sessionCharacteristic", "sessionTxMode", "transactionCharacteristics", 
        "commonTxMode", "readOnlyTxMode", "readWriteTxMode", "beginWithCharacteristics", 
        "beginWithMode", "beginReadOnlyOption", "beginReadWriteOption", 
        "txOptionValue", "txTzOption", "readOnlyTxOption", "readWriteTxOption", 
        "levelOfIsolation",
    ];

    public get grammarFileName(): string { return "Sql.g4"; }
    public get literalNames(): (string | null)[] { return Sql.literalNames; }
    public get symbolicNames(): (string | null)[] { return Sql.symbolicNames; }
    public get ruleNames(): string[] { return Sql.ruleNames; }
    public get serializedATN(): number[] { return Sql._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, Sql._ATN, Sql.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public directSqlStatement(): DirectSqlStatementContext {
        let localContext = new DirectSqlStatementContext(this.context, this.state);
        this.enterRule(localContext, 0, Sql.RULE_directSqlStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 352;
            this.directlyExecutableStatement();
            this.state = 354;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 12) {
                {
                this.state = 353;
                this.match(Sql.SEMI);
                }
            }

            this.state = 356;
            this.match(Sql.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public multiSqlStatement(): MultiSqlStatementContext {
        let localContext = new MultiSqlStatementContext(this.context, this.state);
        this.enterRule(localContext, 2, Sql.RULE_multiSqlStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 358;
            this.directlyExecutableStatement();
            this.state = 363;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 1, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 359;
                    this.match(Sql.SEMI);
                    this.state = 360;
                    this.directlyExecutableStatement();
                    }
                    }
                }
                this.state = 365;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 1, this.context);
            }
            this.state = 367;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 12) {
                {
                this.state = 366;
                this.match(Sql.SEMI);
                }
            }

            this.state = 369;
            this.match(Sql.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public directlyExecutableStatement(): DirectlyExecutableStatementContext {
        let localContext = new DirectlyExecutableStatementContext(this.context, this.state);
        this.enterRule(localContext, 4, Sql.RULE_directlyExecutableStatement);
        let _la: number;
        try {
            this.state = 574;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 34, this.context) ) {
            case 1:
                localContext = new QueryExprContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 375;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 137) {
                    {
                    this.state = 371;
                    this.match(Sql.EXPLAIN);
                    this.state = 373;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 50) {
                        {
                        this.state = 372;
                        this.match(Sql.ANALYZE);
                        }
                    }

                    }
                }

                this.state = 378;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 292) {
                    {
                    this.state = 377;
                    this.settingQueryVariables();
                    }
                }

                this.state = 380;
                this.queryExpression();
                }
                break;
            case 2:
                localContext = new InsertStatementContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 381;
                this.match(Sql.INSERT);
                this.state = 382;
                this.match(Sql.INTO);
                this.state = 383;
                this.targetTable();
                this.state = 384;
                this.insertColumnsAndSource();
                this.state = 386;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 278) {
                    {
                    this.state = 385;
                    this.returningStatement();
                    }
                }

                }
                break;
            case 3:
                localContext = new UpdateStatementContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 388;
                this.match(Sql.UPDATE);
                this.state = 389;
                this.targetTable();
                this.state = 391;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 149) {
                    {
                    this.state = 390;
                    this.dmlStatementValidTimeExtents();
                    }
                }

                this.state = 397;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & 37482721) !== 0) || ((((_la - 88)) & ~0x1F) === 0 && ((1 << (_la - 88)) & 1835401421) !== 0) || ((((_la - 120)) & ~0x1F) === 0 && ((1 << (_la - 120)) & 1314919727) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 394;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 55) {
                        {
                        this.state = 393;
                        this.match(Sql.AS);
                        }
                    }

                    this.state = 396;
                    (localContext as UpdateStatementContext)._correlationName = this.identifier();
                    }
                }

                this.state = 399;
                this.match(Sql.SET);
                this.state = 400;
                this.setClauseList();
                this.state = 403;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 355) {
                    {
                    this.state = 401;
                    this.match(Sql.WHERE);
                    this.state = 402;
                    this.searchCondition();
                    }
                }

                this.state = 406;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 278) {
                    {
                    this.state = 405;
                    this.returningStatement();
                    }
                }

                }
                break;
            case 4:
                localContext = new DeleteStatementContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 408;
                this.match(Sql.DELETE);
                this.state = 409;
                this.match(Sql.FROM);
                this.state = 410;
                this.targetTable();
                this.state = 412;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 149) {
                    {
                    this.state = 411;
                    this.dmlStatementValidTimeExtents();
                    }
                }

                this.state = 418;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & 37482721) !== 0) || ((((_la - 88)) & ~0x1F) === 0 && ((1 << (_la - 88)) & 1835401421) !== 0) || ((((_la - 120)) & ~0x1F) === 0 && ((1 << (_la - 120)) & 1314919727) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 415;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 55) {
                        {
                        this.state = 414;
                        this.match(Sql.AS);
                        }
                    }

                    this.state = 417;
                    (localContext as DeleteStatementContext)._correlationName = this.identifier();
                    }
                }

                this.state = 422;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 355) {
                    {
                    this.state = 420;
                    this.match(Sql.WHERE);
                    this.state = 421;
                    this.searchCondition();
                    }
                }

                this.state = 425;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 278) {
                    {
                    this.state = 424;
                    this.returningStatement();
                    }
                }

                }
                break;
            case 5:
                localContext = new PatchStatementContext(localContext);
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 427;
                this.match(Sql.PATCH);
                this.state = 428;
                this.match(Sql.INTO);
                this.state = 429;
                this.targetTable();
                this.state = 431;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 149) {
                    {
                    this.state = 430;
                    this.patchStatementValidTimeExtents();
                    }
                }

                this.state = 433;
                this.patchSource();
                }
                break;
            case 6:
                localContext = new EraseStatementContext(localContext);
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 435;
                this.match(Sql.ERASE);
                this.state = 436;
                this.match(Sql.FROM);
                this.state = 437;
                this.targetTable();
                this.state = 442;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 55)) & ~0x1F) === 0 && ((1 << (_la - 55)) & 37482721) !== 0) || ((((_la - 88)) & ~0x1F) === 0 && ((1 << (_la - 88)) & 1835401421) !== 0) || ((((_la - 120)) & ~0x1F) === 0 && ((1 << (_la - 120)) & 1314919727) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 439;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 55) {
                        {
                        this.state = 438;
                        this.match(Sql.AS);
                        }
                    }

                    this.state = 441;
                    (localContext as EraseStatementContext)._correlationName = this.identifier();
                    }
                }

                this.state = 446;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 355) {
                    {
                    this.state = 444;
                    this.match(Sql.WHERE);
                    this.state = 445;
                    this.searchCondition();
                    }
                }

                }
                break;
            case 7:
                localContext = new AssertStatementContext(localContext);
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 448;
                this.match(Sql.ASSERT);
                this.state = 449;
                (localContext as AssertStatementContext)._condition = this.expr(0);
                this.state = 452;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 10) {
                    {
                    this.state = 450;
                    this.match(Sql.COMMA);
                    this.state = 451;
                    (localContext as AssertStatementContext)._message = this.characterString();
                    }
                }

                }
                break;
            case 8:
                localContext = new PrepareStatementContext(localContext);
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 454;
                this.match(Sql.PREPARE);
                this.state = 455;
                (localContext as PrepareStatementContext)._statementName = this.identifier();
                this.state = 456;
                this.match(Sql.AS);
                this.state = 457;
                this.directlyExecutableStatement();
                }
                break;
            case 9:
                localContext = new ExecuteStatementContext(localContext);
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 459;
                this.match(Sql.EXECUTE);
                this.state = 460;
                (localContext as ExecuteStatementContext)._statementName = this.identifier();
                this.state = 461;
                this.executeArgs();
                }
                break;
            case 10:
                localContext = new CopyInStmtContext(localContext);
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 463;
                this.match(Sql.COPY);
                this.state = 464;
                this.targetTable();
                this.state = 465;
                this.match(Sql.FROM);
                this.state = 466;
                this.match(Sql.STDIN);
                this.state = 467;
                (localContext as CopyInStmtContext)._opts = this.copyOpts();
                }
                break;
            case 11:
                localContext = new StartTransactionStatementContext(localContext);
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 475;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case Sql.START:
                    {
                    this.state = 469;
                    this.match(Sql.START);
                    this.state = 470;
                    this.match(Sql.TRANSACTION);
                    }
                    break;
                case Sql.BEGIN:
                    {
                    this.state = 471;
                    this.match(Sql.BEGIN);
                    this.state = 473;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 323) {
                        {
                        this.state = 472;
                        this.match(Sql.TRANSACTION);
                        }
                    }

                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                this.state = 479;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 24, this.context) ) {
                case 1:
                    {
                    this.state = 477;
                    this.transactionCharacteristics();
                    }
                    break;
                case 2:
                    {
                    this.state = 478;
                    this.beginWithCharacteristics();
                    }
                    break;
                }
                }
                break;
            case 12:
                localContext = new SetTransactionStatementContext(localContext);
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 481;
                this.match(Sql.SET);
                this.state = 482;
                this.match(Sql.TRANSACTION);
                this.state = 483;
                this.transactionCharacteristics();
                }
                break;
            case 13:
                localContext = new CommitStatementContext(localContext);
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 484;
                this.match(Sql.COMMIT);
                this.state = 486;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 59 || _la === 307) {
                    {
                    this.state = 485;
                    _la = this.tokenStream.LA(1);
                    if(!(_la === 59 || _la === 307)) {
                    this.errorHandler.recoverInline(this);
                    }
                    else {
                        this.errorHandler.reportMatch(this);
                        this.consume();
                    }
                    }
                }

                }
                break;
            case 14:
                localContext = new RollbackStatementContext(localContext);
                this.enterOuterAlt(localContext, 14);
                {
                this.state = 488;
                this.match(Sql.ROLLBACK);
                }
                break;
            case 15:
                localContext = new SetSessionCharacteristicsStatementContext(localContext);
                this.enterOuterAlt(localContext, 15);
                {
                this.state = 489;
                this.match(Sql.SET);
                this.state = 490;
                this.match(Sql.SESSION);
                this.state = 491;
                this.match(Sql.CHARACTERISTICS);
                this.state = 492;
                this.match(Sql.AS);
                this.state = 493;
                this.sessionCharacteristic();
                this.state = 498;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 10) {
                    {
                    {
                    this.state = 494;
                    this.match(Sql.COMMA);
                    this.state = 495;
                    this.sessionCharacteristic();
                    }
                    }
                    this.state = 500;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                }
                break;
            case 16:
                localContext = new DiscardStatementContext(localContext);
                this.enterOuterAlt(localContext, 16);
                {
                this.state = 501;
                this.match(Sql.DISCARD);
                this.state = 502;
                this.discardTarget();
                }
                break;
            case 17:
                localContext = new SetRoleStatementContext(localContext);
                this.enterOuterAlt(localContext, 17);
                {
                this.state = 503;
                this.match(Sql.SET);
                this.state = 504;
                this.match(Sql.ROLE);
                this.state = 507;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case Sql.AT:
                case Sql.ATTACH:
                case Sql.AVG:
                case Sql.BETWEEN:
                case Sql.BIGINT:
                case Sql.BOOL:
                case Sql.BOOLEAN:
                case Sql.BOOL_AND:
                case Sql.BOOL_OR:
                case Sql.BPCHAR:
                case Sql.BY:
                case Sql.BYTEA:
                case Sql.CHAR:
                case Sql.COMMITTED:
                case Sql.COPY:
                case Sql.COUNT:
                case Sql.CUME_DIST:
                case Sql.CURRENT:
                case Sql.DATABASE:
                case Sql.DATE:
                case Sql.DAY:
                case Sql.DEC:
                case Sql.DECIMAL:
                case Sql.DELETE:
                case Sql.DENSE_RANK:
                case Sql.DETACH:
                case Sql.DISCARD:
                case Sql.DOUBLE:
                case Sql.DOW:
                case Sql.DOY:
                case Sql.DURATION:
                case Sql.END:
                case Sql.EPOCH:
                case Sql.ERASE:
                case Sql.EVERY:
                case Sql.FILTER:
                case Sql.FIRST:
                case Sql.FLOAT:
                case Sql.FLOAT4:
                case Sql.FLOAT8:
                case Sql.FORMAT:
                case Sql.HOUR:
                case Sql.INSERT:
                case Sql.INT:
                case Sql.INT2:
                case Sql.INT4:
                case Sql.INT8:
                case Sql.INTEGER:
                case Sql.INTERVAL:
                case Sql.ISODOW:
                case Sql.KEYWORD:
                case Sql.LAST:
                case Sql.LEVEL:
                case Sql.MAX:
                case Sql.METADATA:
                case Sql.MIN:
                case Sql.MINUTE:
                case Sql.MONTH:
                case Sql.NAME:
                case Sql.NEXT:
                case Sql.NUMERIC:
                case Sql.OBJECT:
                case Sql.OF:
                case Sql.OID:
                case Sql.PASSWORD:
                case Sql.PERCENT_RANK:
                case Sql.PERIOD:
                case Sql.PLANS:
                case Sql.POSITION:
                case Sql.PRECISION:
                case Sql.QUARTER:
                case Sql.RANK:
                case Sql.REAL:
                case Sql.RECORD:
                case Sql.REGCLASS:
                case Sql.REGPROC:
                case Sql.ROLE:
                case Sql.ROW:
                case Sql.SECOND:
                case Sql.SELECT:
                case Sql.SEQUENCES:
                case Sql.SETTING:
                case Sql.SMALLINT:
                case Sql.START:
                case Sql.STDDEV_POP:
                case Sql.STDDEV_SAMP:
                case Sql.SUM:
                case Sql.SYNC:
                case Sql.SYSTEM_TIME:
                case Sql.TABLE:
                case Sql.TEMP:
                case Sql.TEMPORARY:
                case Sql.TEXT:
                case Sql.TIME:
                case Sql.TIMESTAMP:
                case Sql.TIMESTAMPTZ:
                case Sql.TIMEZONE:
                case Sql.TSTZRANGE:
                case Sql.UNCOMMITTED:
                case Sql.UPDATE:
                case Sql.URI:
                case Sql.USER:
                case Sql.UUID:
                case Sql.VALID_TIME:
                case Sql.VARCHAR:
                case Sql.VAR_POP:
                case Sql.VAR_SAMP:
                case Sql.VARBINARY:
                case Sql.VERSION:
                case Sql.WEEK:
                case Sql.YEAR:
                case Sql.REGULAR_IDENTIFIER:
                case Sql.DELIMITED_IDENTIFIER:
                    {
                    this.state = 505;
                    this.identifier();
                    }
                    break;
                case Sql.NONE:
                    {
                    this.state = 506;
                    this.match(Sql.NONE);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            case 18:
                localContext = new SetTimeZoneStatementContext(localContext);
                this.enterOuterAlt(localContext, 18);
                {
                this.state = 509;
                this.match(Sql.SET);
                this.state = 511;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 290) {
                    {
                    this.state = 510;
                    this.match(Sql.SESSION);
                    }
                }

                this.state = 516;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case Sql.TIME:
                    {
                    this.state = 513;
                    this.match(Sql.TIME);
                    this.state = 514;
                    this.match(Sql.ZONE);
                    }
                    break;
                case Sql.TIMEZONE:
                    {
                    this.state = 515;
                    this.match(Sql.TIMEZONE);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                this.state = 518;
                (localContext as SetTimeZoneStatementContext)._zone = this.expr(0);
                }
                break;
            case 19:
                localContext = new SetAwaitTokenStatementContext(localContext);
                this.enterOuterAlt(localContext, 19);
                {
                this.state = 519;
                this.match(Sql.SET);
                this.state = 520;
                this.match(Sql.AWAIT_TOKEN);
                this.state = 521;
                _la = this.tokenStream.LA(1);
                if(!(_la === 37 || _la === 321)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 522;
                (localContext as SetAwaitTokenStatementContext)._awaitToken = this.expr(0);
                }
                break;
            case 20:
                localContext = new SetSessionVariableStatementContext(localContext);
                this.enterOuterAlt(localContext, 20);
                {
                this.state = 523;
                this.match(Sql.SET);
                this.state = 525;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 290) {
                    {
                    this.state = 524;
                    this.match(Sql.SESSION);
                    }
                }

                this.state = 527;
                this.identifier();
                this.state = 528;
                _la = this.tokenStream.LA(1);
                if(!(_la === 37 || _la === 321)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 529;
                this.literal();
                }
                break;
            case 21:
                localContext = new ShowVariableStatementContext(localContext);
                this.enterOuterAlt(localContext, 21);
                {
                this.state = 531;
                this.match(Sql.SHOW);
                this.state = 532;
                this.showVariable();
                }
                break;
            case 22:
                localContext = new ShowSessionVariableStatementContext(localContext);
                this.enterOuterAlt(localContext, 22);
                {
                this.state = 533;
                this.match(Sql.SHOW);
                this.state = 534;
                this.identifier();
                }
                break;
            case 23:
                localContext = new ShowAwaitTokenStatementContext(localContext);
                this.enterOuterAlt(localContext, 23);
                {
                this.state = 535;
                this.match(Sql.SHOW);
                this.state = 536;
                this.match(Sql.AWAIT_TOKEN);
                }
                break;
            case 24:
                localContext = new ShowSnapshotTokenStatementContext(localContext);
                this.enterOuterAlt(localContext, 24);
                {
                this.state = 537;
                this.match(Sql.SHOW);
                this.state = 538;
                this.match(Sql.SNAPSHOT_TOKEN);
                }
                break;
            case 25:
                localContext = new ShowClockTimeStatementContext(localContext);
                this.enterOuterAlt(localContext, 25);
                {
                this.state = 539;
                this.match(Sql.SHOW);
                this.state = 540;
                this.match(Sql.CLOCK_TIME);
                }
                break;
            case 26:
                localContext = new AttachDatabaseStatementContext(localContext);
                this.enterOuterAlt(localContext, 26);
                {
                this.state = 541;
                this.match(Sql.ATTACH);
                this.state = 542;
                this.match(Sql.DATABASE);
                this.state = 543;
                (localContext as AttachDatabaseStatementContext)._dbName = this.identifier();
                this.state = 546;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 358) {
                    {
                    this.state = 544;
                    this.match(Sql.WITH);
                    this.state = 545;
                    (localContext as AttachDatabaseStatementContext)._configYaml = this.characterString();
                    }
                }

                }
                break;
            case 27:
                localContext = new DetachDatabaseStatementContext(localContext);
                this.enterOuterAlt(localContext, 27);
                {
                this.state = 548;
                this.match(Sql.DETACH);
                this.state = 549;
                this.match(Sql.DATABASE);
                this.state = 550;
                (localContext as DetachDatabaseStatementContext)._dbName = this.identifier();
                }
                break;
            case 28:
                localContext = new GrantRoleStatementContext(localContext);
                this.enterOuterAlt(localContext, 28);
                {
                this.state = 551;
                this.match(Sql.GRANT);
                this.state = 552;
                (localContext as GrantRoleStatementContext)._roleName = this.identifier();
                this.state = 553;
                this.match(Sql.TO);
                this.state = 554;
                (localContext as GrantRoleStatementContext)._userName = this.identifier();
                }
                break;
            case 29:
                localContext = new RevokeRoleStatementContext(localContext);
                this.enterOuterAlt(localContext, 29);
                {
                this.state = 556;
                this.match(Sql.REVOKE);
                this.state = 557;
                (localContext as RevokeRoleStatementContext)._roleName = this.identifier();
                this.state = 558;
                this.match(Sql.FROM);
                this.state = 559;
                (localContext as RevokeRoleStatementContext)._userName = this.identifier();
                }
                break;
            case 30:
                localContext = new CreateTableStatementContext(localContext);
                this.enterOuterAlt(localContext, 30);
                {
                this.state = 561;
                this.match(Sql.CREATE);
                this.state = 564;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 232) {
                    {
                    this.state = 562;
                    this.match(Sql.OR);
                    this.state = 563;
                    this.match(Sql.ALTER);
                    }
                }

                this.state = 566;
                this.match(Sql.TABLE);
                this.state = 567;
                this.targetTable();
                this.state = 572;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 15) {
                    {
                    this.state = 568;
                    this.match(Sql.LPAREN);
                    this.state = 569;
                    this.columnNameList();
                    this.state = 570;
                    this.match(Sql.RPAREN);
                    }
                }

                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public discardTarget(): DiscardTargetContext {
        let localContext = new DiscardTargetContext(this.context, this.state);
        this.enterRule(localContext, 6, Sql.RULE_discardTarget);
        let _la: number;
        try {
            this.state = 580;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.ALL:
                localContext = new DiscardAllContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 576;
                this.match(Sql.ALL);
                }
                break;
            case Sql.PLANS:
                localContext = new DiscardPlansContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 577;
                this.match(Sql.PLANS);
                }
                break;
            case Sql.TEMP:
            case Sql.TEMPORARY:
                localContext = new DiscardTempContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 578;
                _la = this.tokenStream.LA(1);
                if(!(_la === 310 || _la === 311)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                }
                break;
            case Sql.SEQUENCES:
                localContext = new DiscardSequencesContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 579;
                this.match(Sql.SEQUENCES);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public targetTable(): TargetTableContext {
        let localContext = new TargetTableContext(this.context, this.state);
        this.enterRule(localContext, 8, Sql.RULE_targetTable);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 585;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 36, this.context) ) {
            case 1:
                {
                this.state = 582;
                localContext._schemaName = this.identifier();
                this.state = 583;
                this.match(Sql.DOT);
                }
                break;
            }
            this.state = 587;
            localContext._tableName = this.identifier();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public executeArgs(): ExecuteArgsContext {
        let localContext = new ExecuteArgsContext(this.context, this.state);
        this.enterRule(localContext, 10, Sql.RULE_executeArgs);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 600;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 15) {
                {
                this.state = 589;
                this.match(Sql.LPAREN);
                this.state = 590;
                this.expr(0);
                this.state = 595;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 10) {
                    {
                    {
                    this.state = 591;
                    this.match(Sql.COMMA);
                    this.state = 592;
                    this.expr(0);
                    }
                    }
                    this.state = 597;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 598;
                this.match(Sql.RPAREN);
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public copyOpts(): CopyOptsContext {
        let localContext = new CopyOptsContext(this.context, this.state);
        this.enterRule(localContext, 12, Sql.RULE_copyOpts);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 602;
            this.match(Sql.WITH);
            this.state = 603;
            this.match(Sql.LPAREN);
            this.state = 605;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 150) {
                {
                this.state = 604;
                this.copyOpt();
                }
            }

            this.state = 613;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 10) {
                {
                {
                this.state = 607;
                this.match(Sql.COMMA);
                this.state = 609;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 150) {
                    {
                    this.state = 608;
                    this.copyOpt();
                    }
                }

                }
                }
                this.state = 615;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 616;
            this.match(Sql.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public copyOpt(): CopyOptContext {
        let localContext = new CopyOptContext(this.context, this.state);
        this.enterRule(localContext, 14, Sql.RULE_copyOpt);
        let _la: number;
        try {
            localContext = new CopyFormatOptionContext(localContext);
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 618;
            this.match(Sql.FORMAT);
            this.state = 620;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 37) {
                {
                this.state = 619;
                this.match(Sql.EQUAL);
                }
            }

            this.state = 622;
            (localContext as CopyFormatOptionContext)._format = this.characterString();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public showVariable(): ShowVariableContext {
        let localContext = new ShowVariableContext(this.context, this.state);
        this.enterRule(localContext, 16, Sql.RULE_showVariable);
        try {
            this.state = 632;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.TRANSACTION:
                localContext = new ShowTransactionIsolationLevelContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 624;
                this.match(Sql.TRANSACTION);
                this.state = 625;
                this.match(Sql.ISOLATION);
                this.state = 626;
                this.match(Sql.LEVEL);
                }
                break;
            case Sql.TIME:
            case Sql.TIMEZONE:
                localContext = new ShowTimeZoneContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 630;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case Sql.TIME:
                    {
                    this.state = 627;
                    this.match(Sql.TIME);
                    this.state = 628;
                    this.match(Sql.ZONE);
                    }
                    break;
                case Sql.TIMEZONE:
                    {
                    this.state = 629;
                    this.match(Sql.TIMEZONE);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public settingQueryVariables(): SettingQueryVariablesContext {
        let localContext = new SettingQueryVariablesContext(this.context, this.state);
        this.enterRule(localContext, 18, Sql.RULE_settingQueryVariables);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 634;
            this.match(Sql.SETTING);
            this.state = 635;
            this.settingQueryVariable();
            this.state = 640;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 10) {
                {
                {
                this.state = 636;
                this.match(Sql.COMMA);
                this.state = 637;
                this.settingQueryVariable();
                }
                }
                this.state = 642;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public settingQueryVariable(): SettingQueryVariableContext {
        let localContext = new SettingQueryVariableContext(this.context, this.state);
        this.enterRule(localContext, 20, Sql.RULE_settingQueryVariable);
        let _la: number;
        try {
            this.state = 664;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 48, this.context) ) {
            case 1:
                localContext = new SettingDefaultValidTimeContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 643;
                this.match(Sql.DEFAULT);
                this.state = 644;
                this.match(Sql.VALID_TIME);
                this.state = 646;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 321) {
                    {
                    this.state = 645;
                    this.match(Sql.TO);
                    }
                }

                this.state = 648;
                this.tableTimePeriodSpecification();
                }
                break;
            case 2:
                localContext = new SettingDefaultSystemTimeContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 649;
                this.match(Sql.DEFAULT);
                this.state = 650;
                this.match(Sql.SYSTEM_TIME);
                this.state = 652;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 321) {
                    {
                    this.state = 651;
                    this.match(Sql.TO);
                    }
                }

                this.state = 654;
                this.tableTimePeriodSpecification();
                }
                break;
            case 3:
                localContext = new SettingSnapshotTokenContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 655;
                this.match(Sql.SNAPSHOT_TOKEN);
                this.state = 656;
                _la = this.tokenStream.LA(1);
                if(!(_la === 37 || _la === 321)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 657;
                (localContext as SettingSnapshotTokenContext)._snapshotToken = this.expr(0);
                }
                break;
            case 4:
                localContext = new SettingSnapshotTimeContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 658;
                this.match(Sql.SNAPSHOT_TIME);
                this.state = 659;
                _la = this.tokenStream.LA(1);
                if(!(_la === 37 || _la === 321)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 660;
                (localContext as SettingSnapshotTimeContext)._snapshotTime = this.expr(0);
                }
                break;
            case 5:
                localContext = new SettingClockTimeContext(localContext);
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 661;
                this.match(Sql.CLOCK_TIME);
                this.state = 662;
                _la = this.tokenStream.LA(1);
                if(!(_la === 37 || _la === 321)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 663;
                (localContext as SettingClockTimeContext)._clockTime = this.expr(0);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public intervalLiteral(): IntervalLiteralContext {
        let localContext = new IntervalLiteralContext(this.context, this.state);
        this.enterRule(localContext, 22, Sql.RULE_intervalLiteral);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 666;
            this.match(Sql.INTERVAL);
            this.state = 668;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 24 || _la === 27) {
                {
                this.state = 667;
                _la = this.tokenStream.LA(1);
                if(!(_la === 24 || _la === 27)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                }
            }

            this.state = 670;
            this.characterString();
            this.state = 672;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 50, this.context) ) {
            case 1:
                {
                this.state = 671;
                this.intervalQualifier();
                }
                break;
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public dateTimeLiteral(): DateTimeLiteralContext {
        let localContext = new DateTimeLiteralContext(this.context, this.state);
        this.enterRule(localContext, 24, Sql.RULE_dateTimeLiteral);
        let _la: number;
        try {
            this.state = 681;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.DATE:
                localContext = new DateLiteralContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 674;
                this.match(Sql.DATE);
                this.state = 675;
                this.characterString();
                }
                break;
            case Sql.TIMESTAMP:
                localContext = new TimestampLiteralContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 676;
                this.match(Sql.TIMESTAMP);
                this.state = 678;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 358 || _la === 359) {
                    {
                    this.state = 677;
                    this.withOrWithoutTimeZone();
                    }
                }

                this.state = 680;
                this.characterString();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public integerLiteral(): IntegerLiteralContext {
        let localContext = new IntegerLiteralContext(this.context, this.state);
        this.enterRule(localContext, 26, Sql.RULE_integerLiteral);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 684;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 24 || _la === 27) {
                {
                this.state = 683;
                _la = this.tokenStream.LA(1);
                if(!(_la === 24 || _la === 27)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                }
            }

            this.state = 686;
            this.match(Sql.UNSIGNED_INTEGER);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public literal(): LiteralContext {
        let localContext = new LiteralContext(this.context, this.state);
        this.enterRule(localContext, 28, Sql.RULE_literal);
        let _la: number;
        try {
            this.state = 709;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 55, this.context) ) {
            case 1:
                localContext = new FloatLiteralContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 689;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 24 || _la === 27) {
                    {
                    this.state = 688;
                    _la = this.tokenStream.LA(1);
                    if(!(_la === 24 || _la === 27)) {
                    this.errorHandler.recoverInline(this);
                    }
                    else {
                        this.errorHandler.reportMatch(this);
                        this.consume();
                    }
                    }
                }

                this.state = 691;
                this.match(Sql.UNSIGNED_FLOAT);
                }
                break;
            case 2:
                localContext = new IntegerLiteral0Context(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 692;
                this.integerLiteral();
                }
                break;
            case 3:
                localContext = new CharacterStringLiteralContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 693;
                this.characterString();
                }
                break;
            case 4:
                localContext = new BinaryStringLiteralContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 694;
                this.match(Sql.BINARY_STRING);
                }
                break;
            case 5:
                localContext = new DateTimeLiteral0Context(localContext);
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 695;
                this.dateTimeLiteral();
                }
                break;
            case 6:
                localContext = new TimeLiteralContext(localContext);
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 696;
                this.match(Sql.TIME);
                this.state = 697;
                this.characterString();
                }
                break;
            case 7:
                localContext = new IntervalLiteral0Context(localContext);
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 698;
                this.intervalLiteral();
                }
                break;
            case 8:
                localContext = new DurationLiteralContext(localContext);
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 699;
                this.match(Sql.DURATION);
                this.state = 700;
                this.characterString();
                }
                break;
            case 9:
                localContext = new UUIDLiteralContext(localContext);
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 701;
                this.match(Sql.UUID);
                this.state = 702;
                this.characterString();
                }
                break;
            case 10:
                localContext = new UriLiteralContext(localContext);
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 703;
                this.match(Sql.URI);
                this.state = 704;
                this.characterString();
                }
                break;
            case 11:
                localContext = new KeywordLiteralContext(localContext);
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 705;
                this.match(Sql.KEYWORD);
                this.state = 706;
                this.characterString();
                }
                break;
            case 12:
                localContext = new BooleanLiteralContext(localContext);
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 707;
                _la = this.tokenStream.LA(1);
                if(!(_la === 139 || _la === 227 || _la === 230 || _la === 326)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                }
                break;
            case 13:
                localContext = new NullLiteralContext(localContext);
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 708;
                this.match(Sql.NULL);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public dollarStringText(): DollarStringTextContext {
        let localContext = new DollarStringTextContext(this.context, this.state);
        this.enterRule(localContext, 30, Sql.RULE_dollarStringText);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 712;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 711;
                this.match(Sql.DM_TEXT);
                }
                }
                this.state = 714;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 368);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public characterString(): CharacterStringContext {
        let localContext = new CharacterStringContext(this.context, this.state);
        this.enterRule(localContext, 32, Sql.RULE_characterString);
        let _la: number;
        try {
            this.state = 723;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.CHARACTER_STRING:
                localContext = new SqlStandardStringContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 716;
                this.match(Sql.CHARACTER_STRING);
                }
                break;
            case Sql.C_ESCAPES_STRING:
                localContext = new CEscapesStringContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 717;
                this.match(Sql.C_ESCAPES_STRING);
                }
                break;
            case Sql.DOLLAR_TAG:
                localContext = new DollarStringContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 718;
                this.match(Sql.DOLLAR_TAG);
                this.state = 720;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 368) {
                    {
                    this.state = 719;
                    this.dollarStringText();
                    }
                }

                this.state = 722;
                this.match(Sql.DM_END_TAG);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public intervalQualifier(): IntervalQualifierContext {
        let localContext = new IntervalQualifierContext(this.context, this.state);
        this.enterRule(localContext, 34, Sql.RULE_intervalQualifier);
        try {
            this.state = 730;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 59, this.context) ) {
            case 1:
                localContext = new MultiFieldIntervalContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 725;
                (localContext as MultiFieldIntervalContext)._startField = this.nonSecondPrimaryDatetimeField();
                this.state = 726;
                this.match(Sql.TO);
                this.state = 727;
                (localContext as MultiFieldIntervalContext)._endField = this.singleDatetimeField();
                }
                break;
            case 2:
                localContext = new SingleFieldIntervalContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 729;
                this.singleDatetimeField();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public intervalFractionalSecondsPrecision(): IntervalFractionalSecondsPrecisionContext {
        let localContext = new IntervalFractionalSecondsPrecisionContext(this.context, this.state);
        this.enterRule(localContext, 36, Sql.RULE_intervalFractionalSecondsPrecision);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 732;
            this.match(Sql.UNSIGNED_INTEGER);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public nonSecondPrimaryDatetimeField(): NonSecondPrimaryDatetimeFieldContext {
        let localContext = new NonSecondPrimaryDatetimeFieldContext(this.context, this.state);
        this.enterRule(localContext, 38, Sql.RULE_nonSecondPrimaryDatetimeField);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 734;
            _la = this.tokenStream.LA(1);
            if(!(_la === 109 || _la === 162 || _la === 206 || _la === 207 || _la === 362)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public singleDatetimeField(): SingleDatetimeFieldContext {
        let localContext = new SingleDatetimeFieldContext(this.context, this.state);
        this.enterRule(localContext, 40, Sql.RULE_singleDatetimeField);
        try {
            this.state = 744;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.DAY:
            case Sql.HOUR:
            case Sql.MINUTE:
            case Sql.MONTH:
            case Sql.YEAR:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 736;
                this.nonSecondPrimaryDatetimeField();
                }
                break;
            case Sql.SECOND:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 737;
                this.match(Sql.SECOND);
                this.state = 742;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 60, this.context) ) {
                case 1:
                    {
                    this.state = 738;
                    this.match(Sql.LPAREN);
                    this.state = 739;
                    this.intervalFractionalSecondsPrecision();
                    this.state = 740;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public identifierChain(): IdentifierChainContext {
        let localContext = new IdentifierChainContext(this.context, this.state);
        this.enterRule(localContext, 42, Sql.RULE_identifierChain);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 746;
            this.identifier();
            this.state = 751;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 62, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 747;
                    this.match(Sql.DOT);
                    this.state = 748;
                    this.identifier();
                    }
                    }
                }
                this.state = 753;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 62, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public identifier(): IdentifierContext {
        let localContext = new IdentifierContext(this.context, this.state);
        this.enterRule(localContext, 44, Sql.RULE_identifier);
        try {
            this.state = 759;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.AT:
            case Sql.ATTACH:
            case Sql.AVG:
            case Sql.BETWEEN:
            case Sql.BIGINT:
            case Sql.BOOL:
            case Sql.BOOLEAN:
            case Sql.BOOL_AND:
            case Sql.BOOL_OR:
            case Sql.BPCHAR:
            case Sql.BY:
            case Sql.BYTEA:
            case Sql.CHAR:
            case Sql.COMMITTED:
            case Sql.COPY:
            case Sql.COUNT:
            case Sql.CUME_DIST:
            case Sql.CURRENT:
            case Sql.DATABASE:
            case Sql.DATE:
            case Sql.DAY:
            case Sql.DEC:
            case Sql.DECIMAL:
            case Sql.DELETE:
            case Sql.DENSE_RANK:
            case Sql.DETACH:
            case Sql.DISCARD:
            case Sql.DOUBLE:
            case Sql.DOW:
            case Sql.DOY:
            case Sql.DURATION:
            case Sql.END:
            case Sql.EPOCH:
            case Sql.ERASE:
            case Sql.EVERY:
            case Sql.FILTER:
            case Sql.FIRST:
            case Sql.FLOAT:
            case Sql.FLOAT4:
            case Sql.FLOAT8:
            case Sql.FORMAT:
            case Sql.HOUR:
            case Sql.INSERT:
            case Sql.INT:
            case Sql.INT2:
            case Sql.INT4:
            case Sql.INT8:
            case Sql.INTEGER:
            case Sql.INTERVAL:
            case Sql.ISODOW:
            case Sql.KEYWORD:
            case Sql.LAST:
            case Sql.LEVEL:
            case Sql.MAX:
            case Sql.METADATA:
            case Sql.MIN:
            case Sql.MINUTE:
            case Sql.MONTH:
            case Sql.NAME:
            case Sql.NEXT:
            case Sql.NUMERIC:
            case Sql.OBJECT:
            case Sql.OF:
            case Sql.OID:
            case Sql.PASSWORD:
            case Sql.PERCENT_RANK:
            case Sql.PERIOD:
            case Sql.PLANS:
            case Sql.POSITION:
            case Sql.PRECISION:
            case Sql.QUARTER:
            case Sql.RANK:
            case Sql.REAL:
            case Sql.RECORD:
            case Sql.REGCLASS:
            case Sql.REGPROC:
            case Sql.ROLE:
            case Sql.ROW:
            case Sql.SECOND:
            case Sql.SELECT:
            case Sql.SEQUENCES:
            case Sql.SETTING:
            case Sql.SMALLINT:
            case Sql.START:
            case Sql.STDDEV_POP:
            case Sql.STDDEV_SAMP:
            case Sql.SUM:
            case Sql.SYNC:
            case Sql.SYSTEM_TIME:
            case Sql.TABLE:
            case Sql.TEMP:
            case Sql.TEMPORARY:
            case Sql.TEXT:
            case Sql.TIME:
            case Sql.TIMESTAMP:
            case Sql.TIMESTAMPTZ:
            case Sql.TIMEZONE:
            case Sql.TSTZRANGE:
            case Sql.UNCOMMITTED:
            case Sql.UPDATE:
            case Sql.URI:
            case Sql.USER:
            case Sql.UUID:
            case Sql.VALID_TIME:
            case Sql.VARCHAR:
            case Sql.VAR_POP:
            case Sql.VAR_SAMP:
            case Sql.VARBINARY:
            case Sql.VERSION:
            case Sql.WEEK:
            case Sql.YEAR:
            case Sql.REGULAR_IDENTIFIER:
                localContext = new RegularIdentifierContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 756;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case Sql.REGULAR_IDENTIFIER:
                    {
                    this.state = 754;
                    this.match(Sql.REGULAR_IDENTIFIER);
                    }
                    break;
                case Sql.AT:
                case Sql.ATTACH:
                case Sql.AVG:
                case Sql.BETWEEN:
                case Sql.BIGINT:
                case Sql.BOOL:
                case Sql.BOOLEAN:
                case Sql.BOOL_AND:
                case Sql.BOOL_OR:
                case Sql.BPCHAR:
                case Sql.BY:
                case Sql.BYTEA:
                case Sql.CHAR:
                case Sql.COMMITTED:
                case Sql.COPY:
                case Sql.COUNT:
                case Sql.CUME_DIST:
                case Sql.CURRENT:
                case Sql.DATABASE:
                case Sql.DATE:
                case Sql.DAY:
                case Sql.DEC:
                case Sql.DECIMAL:
                case Sql.DELETE:
                case Sql.DENSE_RANK:
                case Sql.DETACH:
                case Sql.DISCARD:
                case Sql.DOUBLE:
                case Sql.DOW:
                case Sql.DOY:
                case Sql.DURATION:
                case Sql.END:
                case Sql.EPOCH:
                case Sql.ERASE:
                case Sql.EVERY:
                case Sql.FILTER:
                case Sql.FIRST:
                case Sql.FLOAT:
                case Sql.FLOAT4:
                case Sql.FLOAT8:
                case Sql.FORMAT:
                case Sql.HOUR:
                case Sql.INSERT:
                case Sql.INT:
                case Sql.INT2:
                case Sql.INT4:
                case Sql.INT8:
                case Sql.INTEGER:
                case Sql.INTERVAL:
                case Sql.ISODOW:
                case Sql.KEYWORD:
                case Sql.LAST:
                case Sql.LEVEL:
                case Sql.MAX:
                case Sql.METADATA:
                case Sql.MIN:
                case Sql.MINUTE:
                case Sql.MONTH:
                case Sql.NAME:
                case Sql.NEXT:
                case Sql.NUMERIC:
                case Sql.OBJECT:
                case Sql.OF:
                case Sql.OID:
                case Sql.PASSWORD:
                case Sql.PERCENT_RANK:
                case Sql.PERIOD:
                case Sql.PLANS:
                case Sql.POSITION:
                case Sql.PRECISION:
                case Sql.QUARTER:
                case Sql.RANK:
                case Sql.REAL:
                case Sql.RECORD:
                case Sql.REGCLASS:
                case Sql.REGPROC:
                case Sql.ROLE:
                case Sql.ROW:
                case Sql.SECOND:
                case Sql.SELECT:
                case Sql.SEQUENCES:
                case Sql.SETTING:
                case Sql.SMALLINT:
                case Sql.START:
                case Sql.STDDEV_POP:
                case Sql.STDDEV_SAMP:
                case Sql.SUM:
                case Sql.SYNC:
                case Sql.SYSTEM_TIME:
                case Sql.TABLE:
                case Sql.TEMP:
                case Sql.TEMPORARY:
                case Sql.TEXT:
                case Sql.TIME:
                case Sql.TIMESTAMP:
                case Sql.TIMESTAMPTZ:
                case Sql.TIMEZONE:
                case Sql.TSTZRANGE:
                case Sql.UNCOMMITTED:
                case Sql.UPDATE:
                case Sql.URI:
                case Sql.USER:
                case Sql.UUID:
                case Sql.VALID_TIME:
                case Sql.VARCHAR:
                case Sql.VAR_POP:
                case Sql.VAR_SAMP:
                case Sql.VARBINARY:
                case Sql.VERSION:
                case Sql.WEEK:
                case Sql.YEAR:
                    {
                    this.state = 755;
                    this.nonReservedKeyword();
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            case Sql.DELIMITED_IDENTIFIER:
                localContext = new DelimitedIdentifierContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 758;
                this.match(Sql.DELIMITED_IDENTIFIER);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public nonReservedKeyword(): NonReservedKeywordContext {
        let localContext = new NonReservedKeywordContext(this.context, this.state);
        this.enterRule(localContext, 46, Sql.RULE_nonReservedKeyword);
        try {
            this.state = 848;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.START:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 761;
                this.match(Sql.START);
                }
                break;
            case Sql.END:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 762;
                this.match(Sql.END);
                }
                break;
            case Sql.COMMITTED:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 763;
                this.match(Sql.COMMITTED);
                }
                break;
            case Sql.UNCOMMITTED:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 764;
                this.match(Sql.UNCOMMITTED);
                }
                break;
            case Sql.TIMEZONE:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 765;
                this.match(Sql.TIMEZONE);
                }
                break;
            case Sql.VERSION:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 766;
                this.match(Sql.VERSION);
                }
                break;
            case Sql.SYSTEM_TIME:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 767;
                this.match(Sql.SYSTEM_TIME);
                }
                break;
            case Sql.VALID_TIME:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 768;
                this.match(Sql.VALID_TIME);
                }
                break;
            case Sql.SELECT:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 769;
                this.match(Sql.SELECT);
                }
                break;
            case Sql.INSERT:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 770;
                this.match(Sql.INSERT);
                }
                break;
            case Sql.UPDATE:
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 771;
                this.match(Sql.UPDATE);
                }
                break;
            case Sql.DELETE:
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 772;
                this.match(Sql.DELETE);
                }
                break;
            case Sql.ERASE:
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 773;
                this.match(Sql.ERASE);
                }
                break;
            case Sql.SETTING:
                this.enterOuterAlt(localContext, 14);
                {
                this.state = 774;
                this.match(Sql.SETTING);
                }
                break;
            case Sql.ROLE:
                this.enterOuterAlt(localContext, 15);
                {
                this.state = 775;
                this.match(Sql.ROLE);
                }
                break;
            case Sql.USER:
                this.enterOuterAlt(localContext, 16);
                {
                this.state = 776;
                this.match(Sql.USER);
                }
                break;
            case Sql.PASSWORD:
                this.enterOuterAlt(localContext, 17);
                {
                this.state = 777;
                this.match(Sql.PASSWORD);
                }
                break;
            case Sql.VARBINARY:
                this.enterOuterAlt(localContext, 18);
                {
                this.state = 778;
                this.match(Sql.VARBINARY);
                }
                break;
            case Sql.BYTEA:
                this.enterOuterAlt(localContext, 19);
                {
                this.state = 779;
                this.match(Sql.BYTEA);
                }
                break;
            case Sql.URI:
                this.enterOuterAlt(localContext, 20);
                {
                this.state = 780;
                this.match(Sql.URI);
                }
                break;
            case Sql.OID:
                this.enterOuterAlt(localContext, 21);
                {
                this.state = 781;
                this.match(Sql.OID);
                }
                break;
            case Sql.COPY:
                this.enterOuterAlt(localContext, 22);
                {
                this.state = 782;
                this.match(Sql.COPY);
                }
                break;
            case Sql.FORMAT:
                this.enterOuterAlt(localContext, 23);
                {
                this.state = 783;
                this.match(Sql.FORMAT);
                }
                break;
            case Sql.ATTACH:
                this.enterOuterAlt(localContext, 24);
                {
                this.state = 784;
                this.match(Sql.ATTACH);
                }
                break;
            case Sql.DETACH:
                this.enterOuterAlt(localContext, 25);
                {
                this.state = 785;
                this.match(Sql.DETACH);
                }
                break;
            case Sql.DATABASE:
                this.enterOuterAlt(localContext, 26);
                {
                this.state = 786;
                this.match(Sql.DATABASE);
                }
                break;
            case Sql.LEVEL:
                this.enterOuterAlt(localContext, 27);
                {
                this.state = 787;
                this.match(Sql.LEVEL);
                }
                break;
            case Sql.FILTER:
                this.enterOuterAlt(localContext, 28);
                {
                this.state = 788;
                this.match(Sql.FILTER);
                }
                break;
            case Sql.TABLE:
                this.enterOuterAlt(localContext, 29);
                {
                this.state = 789;
                this.match(Sql.TABLE);
                }
                break;
            case Sql.METADATA:
                this.enterOuterAlt(localContext, 30);
                {
                this.state = 790;
                this.match(Sql.METADATA);
                }
                break;
            case Sql.SYNC:
                this.enterOuterAlt(localContext, 31);
                {
                this.state = 791;
                this.match(Sql.SYNC);
                }
                break;
            case Sql.DISCARD:
                this.enterOuterAlt(localContext, 32);
                {
                this.state = 792;
                this.match(Sql.DISCARD);
                }
                break;
            case Sql.PLANS:
                this.enterOuterAlt(localContext, 33);
                {
                this.state = 793;
                this.match(Sql.PLANS);
                }
                break;
            case Sql.TEMP:
                this.enterOuterAlt(localContext, 34);
                {
                this.state = 794;
                this.match(Sql.TEMP);
                }
                break;
            case Sql.TEMPORARY:
                this.enterOuterAlt(localContext, 35);
                {
                this.state = 795;
                this.match(Sql.TEMPORARY);
                }
                break;
            case Sql.SEQUENCES:
                this.enterOuterAlt(localContext, 36);
                {
                this.state = 796;
                this.match(Sql.SEQUENCES);
                }
                break;
            case Sql.AVG:
            case Sql.BOOL_AND:
            case Sql.BOOL_OR:
            case Sql.COUNT:
            case Sql.EVERY:
            case Sql.MAX:
            case Sql.MIN:
            case Sql.STDDEV_POP:
            case Sql.STDDEV_SAMP:
            case Sql.SUM:
            case Sql.VAR_POP:
            case Sql.VAR_SAMP:
                this.enterOuterAlt(localContext, 37);
                {
                this.state = 797;
                this.setFunctionType();
                }
                break;
            case Sql.DAY:
            case Sql.HOUR:
            case Sql.MINUTE:
            case Sql.MONTH:
            case Sql.SECOND:
            case Sql.YEAR:
                this.enterOuterAlt(localContext, 38);
                {
                this.state = 798;
                this.primaryDatetimeField();
                }
                break;
            case Sql.DOW:
            case Sql.DOY:
            case Sql.EPOCH:
            case Sql.ISODOW:
            case Sql.QUARTER:
            case Sql.WEEK:
                this.enterOuterAlt(localContext, 39);
                {
                this.state = 799;
                this.pgExtractField();
                }
                break;
            case Sql.CUME_DIST:
            case Sql.DENSE_RANK:
            case Sql.PERCENT_RANK:
            case Sql.RANK:
                this.enterOuterAlt(localContext, 40);
                {
                this.state = 800;
                this.rankFunctionType();
                }
                break;
            case Sql.AT:
                this.enterOuterAlt(localContext, 41);
                {
                this.state = 801;
                this.match(Sql.AT);
                }
                break;
            case Sql.BETWEEN:
                this.enterOuterAlt(localContext, 42);
                {
                this.state = 802;
                this.match(Sql.BETWEEN);
                }
                break;
            case Sql.BY:
                this.enterOuterAlt(localContext, 43);
                {
                this.state = 803;
                this.match(Sql.BY);
                }
                break;
            case Sql.CURRENT:
                this.enterOuterAlt(localContext, 44);
                {
                this.state = 804;
                this.match(Sql.CURRENT);
                }
                break;
            case Sql.FIRST:
                this.enterOuterAlt(localContext, 45);
                {
                this.state = 805;
                this.match(Sql.FIRST);
                }
                break;
            case Sql.LAST:
                this.enterOuterAlt(localContext, 46);
                {
                this.state = 806;
                this.match(Sql.LAST);
                }
                break;
            case Sql.NEXT:
                this.enterOuterAlt(localContext, 47);
                {
                this.state = 807;
                this.match(Sql.NEXT);
                }
                break;
            case Sql.OF:
                this.enterOuterAlt(localContext, 48);
                {
                this.state = 808;
                this.match(Sql.OF);
                }
                break;
            case Sql.POSITION:
                this.enterOuterAlt(localContext, 49);
                {
                this.state = 809;
                this.match(Sql.POSITION);
                }
                break;
            case Sql.INT2:
                this.enterOuterAlt(localContext, 50);
                {
                this.state = 810;
                this.match(Sql.INT2);
                }
                break;
            case Sql.INT4:
                this.enterOuterAlt(localContext, 51);
                {
                this.state = 811;
                this.match(Sql.INT4);
                }
                break;
            case Sql.INT8:
                this.enterOuterAlt(localContext, 52);
                {
                this.state = 812;
                this.match(Sql.INT8);
                }
                break;
            case Sql.FLOAT4:
                this.enterOuterAlt(localContext, 53);
                {
                this.state = 813;
                this.match(Sql.FLOAT4);
                }
                break;
            case Sql.FLOAT8:
                this.enterOuterAlt(localContext, 54);
                {
                this.state = 814;
                this.match(Sql.FLOAT8);
                }
                break;
            case Sql.BOOL:
                this.enterOuterAlt(localContext, 55);
                {
                this.state = 815;
                this.match(Sql.BOOL);
                }
                break;
            case Sql.BPCHAR:
                this.enterOuterAlt(localContext, 56);
                {
                this.state = 816;
                this.match(Sql.BPCHAR);
                }
                break;
            case Sql.NAME:
                this.enterOuterAlt(localContext, 57);
                {
                this.state = 817;
                this.match(Sql.NAME);
                }
                break;
            case Sql.BIGINT:
                this.enterOuterAlt(localContext, 58);
                {
                this.state = 818;
                this.match(Sql.BIGINT);
                }
                break;
            case Sql.BOOLEAN:
                this.enterOuterAlt(localContext, 59);
                {
                this.state = 819;
                this.match(Sql.BOOLEAN);
                }
                break;
            case Sql.CHAR:
                this.enterOuterAlt(localContext, 60);
                {
                this.state = 820;
                this.match(Sql.CHAR);
                }
                break;
            case Sql.DATE:
                this.enterOuterAlt(localContext, 61);
                {
                this.state = 821;
                this.match(Sql.DATE);
                }
                break;
            case Sql.DEC:
                this.enterOuterAlt(localContext, 62);
                {
                this.state = 822;
                this.match(Sql.DEC);
                }
                break;
            case Sql.DECIMAL:
                this.enterOuterAlt(localContext, 63);
                {
                this.state = 823;
                this.match(Sql.DECIMAL);
                }
                break;
            case Sql.DOUBLE:
                this.enterOuterAlt(localContext, 64);
                {
                this.state = 824;
                this.match(Sql.DOUBLE);
                }
                break;
            case Sql.DURATION:
                this.enterOuterAlt(localContext, 65);
                {
                this.state = 825;
                this.match(Sql.DURATION);
                }
                break;
            case Sql.FLOAT:
                this.enterOuterAlt(localContext, 66);
                {
                this.state = 826;
                this.match(Sql.FLOAT);
                }
                break;
            case Sql.INT:
                this.enterOuterAlt(localContext, 67);
                {
                this.state = 827;
                this.match(Sql.INT);
                }
                break;
            case Sql.INTEGER:
                this.enterOuterAlt(localContext, 68);
                {
                this.state = 828;
                this.match(Sql.INTEGER);
                }
                break;
            case Sql.INTERVAL:
                this.enterOuterAlt(localContext, 69);
                {
                this.state = 829;
                this.match(Sql.INTERVAL);
                }
                break;
            case Sql.KEYWORD:
                this.enterOuterAlt(localContext, 70);
                {
                this.state = 830;
                this.match(Sql.KEYWORD);
                }
                break;
            case Sql.NUMERIC:
                this.enterOuterAlt(localContext, 71);
                {
                this.state = 831;
                this.match(Sql.NUMERIC);
                }
                break;
            case Sql.OBJECT:
                this.enterOuterAlt(localContext, 72);
                {
                this.state = 832;
                this.match(Sql.OBJECT);
                }
                break;
            case Sql.PERIOD:
                this.enterOuterAlt(localContext, 73);
                {
                this.state = 833;
                this.match(Sql.PERIOD);
                }
                break;
            case Sql.PRECISION:
                this.enterOuterAlt(localContext, 74);
                {
                this.state = 834;
                this.match(Sql.PRECISION);
                }
                break;
            case Sql.REAL:
                this.enterOuterAlt(localContext, 75);
                {
                this.state = 835;
                this.match(Sql.REAL);
                }
                break;
            case Sql.RECORD:
                this.enterOuterAlt(localContext, 76);
                {
                this.state = 836;
                this.match(Sql.RECORD);
                }
                break;
            case Sql.REGCLASS:
                this.enterOuterAlt(localContext, 77);
                {
                this.state = 837;
                this.match(Sql.REGCLASS);
                }
                break;
            case Sql.REGPROC:
                this.enterOuterAlt(localContext, 78);
                {
                this.state = 838;
                this.match(Sql.REGPROC);
                }
                break;
            case Sql.ROW:
                this.enterOuterAlt(localContext, 79);
                {
                this.state = 839;
                this.match(Sql.ROW);
                }
                break;
            case Sql.SMALLINT:
                this.enterOuterAlt(localContext, 80);
                {
                this.state = 840;
                this.match(Sql.SMALLINT);
                }
                break;
            case Sql.TEXT:
                this.enterOuterAlt(localContext, 81);
                {
                this.state = 841;
                this.match(Sql.TEXT);
                }
                break;
            case Sql.TIME:
                this.enterOuterAlt(localContext, 82);
                {
                this.state = 842;
                this.match(Sql.TIME);
                }
                break;
            case Sql.TIMESTAMP:
                this.enterOuterAlt(localContext, 83);
                {
                this.state = 843;
                this.match(Sql.TIMESTAMP);
                }
                break;
            case Sql.TIMESTAMPTZ:
                this.enterOuterAlt(localContext, 84);
                {
                this.state = 844;
                this.match(Sql.TIMESTAMPTZ);
                }
                break;
            case Sql.TSTZRANGE:
                this.enterOuterAlt(localContext, 85);
                {
                this.state = 845;
                this.match(Sql.TSTZRANGE);
                }
                break;
            case Sql.UUID:
                this.enterOuterAlt(localContext, 86);
                {
                this.state = 846;
                this.match(Sql.UUID);
                }
                break;
            case Sql.VARCHAR:
                this.enterOuterAlt(localContext, 87);
                {
                this.state = 847;
                this.match(Sql.VARCHAR);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public columnName(): ColumnNameContext {
        let localContext = new ColumnNameContext(this.context, this.state);
        this.enterRule(localContext, 48, Sql.RULE_columnName);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 850;
            this.identifier();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public columnLabel(): ColumnLabelContext {
        let localContext = new ColumnLabelContext(this.context, this.state);
        this.enterRule(localContext, 50, Sql.RULE_columnLabel);
        try {
            this.state = 854;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.AT:
            case Sql.ATTACH:
            case Sql.AVG:
            case Sql.BETWEEN:
            case Sql.BIGINT:
            case Sql.BOOL:
            case Sql.BOOLEAN:
            case Sql.BOOL_AND:
            case Sql.BOOL_OR:
            case Sql.BPCHAR:
            case Sql.BY:
            case Sql.BYTEA:
            case Sql.CHAR:
            case Sql.COMMITTED:
            case Sql.COPY:
            case Sql.COUNT:
            case Sql.CUME_DIST:
            case Sql.CURRENT:
            case Sql.DATABASE:
            case Sql.DATE:
            case Sql.DAY:
            case Sql.DEC:
            case Sql.DECIMAL:
            case Sql.DELETE:
            case Sql.DENSE_RANK:
            case Sql.DETACH:
            case Sql.DISCARD:
            case Sql.DOUBLE:
            case Sql.DOW:
            case Sql.DOY:
            case Sql.DURATION:
            case Sql.END:
            case Sql.EPOCH:
            case Sql.ERASE:
            case Sql.EVERY:
            case Sql.FILTER:
            case Sql.FIRST:
            case Sql.FLOAT:
            case Sql.FLOAT4:
            case Sql.FLOAT8:
            case Sql.FORMAT:
            case Sql.HOUR:
            case Sql.INSERT:
            case Sql.INT:
            case Sql.INT2:
            case Sql.INT4:
            case Sql.INT8:
            case Sql.INTEGER:
            case Sql.INTERVAL:
            case Sql.ISODOW:
            case Sql.KEYWORD:
            case Sql.LAST:
            case Sql.LEVEL:
            case Sql.MAX:
            case Sql.METADATA:
            case Sql.MIN:
            case Sql.MINUTE:
            case Sql.MONTH:
            case Sql.NAME:
            case Sql.NEXT:
            case Sql.NUMERIC:
            case Sql.OBJECT:
            case Sql.OF:
            case Sql.OID:
            case Sql.PASSWORD:
            case Sql.PERCENT_RANK:
            case Sql.PERIOD:
            case Sql.PLANS:
            case Sql.POSITION:
            case Sql.PRECISION:
            case Sql.QUARTER:
            case Sql.RANK:
            case Sql.REAL:
            case Sql.RECORD:
            case Sql.REGCLASS:
            case Sql.REGPROC:
            case Sql.ROLE:
            case Sql.ROW:
            case Sql.SECOND:
            case Sql.SELECT:
            case Sql.SEQUENCES:
            case Sql.SETTING:
            case Sql.SMALLINT:
            case Sql.START:
            case Sql.STDDEV_POP:
            case Sql.STDDEV_SAMP:
            case Sql.SUM:
            case Sql.SYNC:
            case Sql.SYSTEM_TIME:
            case Sql.TABLE:
            case Sql.TEMP:
            case Sql.TEMPORARY:
            case Sql.TEXT:
            case Sql.TIME:
            case Sql.TIMESTAMP:
            case Sql.TIMESTAMPTZ:
            case Sql.TIMEZONE:
            case Sql.TSTZRANGE:
            case Sql.UNCOMMITTED:
            case Sql.UPDATE:
            case Sql.URI:
            case Sql.USER:
            case Sql.UUID:
            case Sql.VALID_TIME:
            case Sql.VARCHAR:
            case Sql.VAR_POP:
            case Sql.VAR_SAMP:
            case Sql.VARBINARY:
            case Sql.VERSION:
            case Sql.WEEK:
            case Sql.YEAR:
            case Sql.REGULAR_IDENTIFIER:
            case Sql.DELIMITED_IDENTIFIER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 852;
                this.identifier();
                }
                break;
            case Sql.CURRENT_USER:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 853;
                this.match(Sql.CURRENT_USER);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public dataType(): DataTypeContext;
    public dataType(_p: number): DataTypeContext;
    public dataType(_p?: number): DataTypeContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new DataTypeContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 52;
        this.enterRecursionRule(localContext, 52, Sql.RULE_dataType, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 939;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.DEC:
            case Sql.DECIMAL:
            case Sql.NUMERIC:
                {
                localContext = new DecimalTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 857;
                _la = this.tokenStream.LA(1);
                if(!(_la === 110 || _la === 112 || _la === 223)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 866;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 68, this.context) ) {
                case 1:
                    {
                    this.state = 858;
                    this.match(Sql.LPAREN);
                    this.state = 859;
                    this.precision();
                    this.state = 862;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 10) {
                        {
                        this.state = 860;
                        this.match(Sql.COMMA);
                        this.state = 861;
                        this.scale();
                        }
                    }

                    this.state = 864;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            case Sql.BIGINT:
            case Sql.INT:
            case Sql.INT2:
            case Sql.INT4:
            case Sql.INT8:
            case Sql.INTEGER:
            case Sql.SMALLINT:
                {
                localContext = new IntegerTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 868;
                _la = this.tokenStream.LA(1);
                if(!(_la === 68 || ((((_la - 168)) & ~0x1F) === 0 && ((1 << (_la - 168)) & 31) !== 0) || _la === 294)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                }
                break;
            case Sql.FLOAT:
                {
                localContext = new FloatTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 869;
                this.match(Sql.FLOAT);
                this.state = 874;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 69, this.context) ) {
                case 1:
                    {
                    this.state = 870;
                    this.match(Sql.LPAREN);
                    this.state = 871;
                    this.precision();
                    this.state = 872;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            case Sql.FLOAT4:
            case Sql.REAL:
                {
                localContext = new RealTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 876;
                _la = this.tokenStream.LA(1);
                if(!(_la === 146 || _la === 267)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                }
                break;
            case Sql.DOUBLE:
            case Sql.FLOAT8:
                {
                localContext = new DoubleTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 882;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case Sql.DOUBLE:
                    {
                    this.state = 877;
                    this.match(Sql.DOUBLE);
                    this.state = 879;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 70, this.context) ) {
                    case 1:
                        {
                        this.state = 878;
                        this.match(Sql.PRECISION);
                        }
                        break;
                    }
                    }
                    break;
                case Sql.FLOAT8:
                    {
                    this.state = 881;
                    this.match(Sql.FLOAT8);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            case Sql.BOOL:
            case Sql.BOOLEAN:
                {
                localContext = new BooleanTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 884;
                _la = this.tokenStream.LA(1);
                if(!(_la === 69 || _la === 70)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                }
                break;
            case Sql.DATE:
                {
                localContext = new DateTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 885;
                this.match(Sql.DATE);
                }
                break;
            case Sql.TIME:
                {
                localContext = new TimeTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 886;
                this.match(Sql.TIME);
                this.state = 891;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 72, this.context) ) {
                case 1:
                    {
                    this.state = 887;
                    this.match(Sql.LPAREN);
                    this.state = 888;
                    this.precision();
                    this.state = 889;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                this.state = 894;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 73, this.context) ) {
                case 1:
                    {
                    this.state = 893;
                    this.withOrWithoutTimeZone();
                    }
                    break;
                }
                }
                break;
            case Sql.TIMESTAMP:
                {
                localContext = new TimestampTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 896;
                this.match(Sql.TIMESTAMP);
                this.state = 901;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 74, this.context) ) {
                case 1:
                    {
                    this.state = 897;
                    this.match(Sql.LPAREN);
                    this.state = 898;
                    this.precision();
                    this.state = 899;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                this.state = 904;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 75, this.context) ) {
                case 1:
                    {
                    this.state = 903;
                    this.withOrWithoutTimeZone();
                    }
                    break;
                }
                }
                break;
            case Sql.TIMESTAMPTZ:
                {
                localContext = new TimestampTzTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 906;
                this.match(Sql.TIMESTAMPTZ);
                }
                break;
            case Sql.INTERVAL:
                {
                localContext = new IntervalTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 907;
                this.match(Sql.INTERVAL);
                this.state = 909;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 76, this.context) ) {
                case 1:
                    {
                    this.state = 908;
                    this.intervalQualifier();
                    }
                    break;
                }
                }
                break;
            case Sql.BPCHAR:
            case Sql.CHAR:
            case Sql.NAME:
            case Sql.TEXT:
            case Sql.VARCHAR:
                {
                localContext = new CharacterStringTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 911;
                _la = this.tokenStream.LA(1);
                if(!(_la === 74 || _la === 80 || _la === 208 || _la === 312 || _la === 348)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                }
                break;
            case Sql.DURATION:
                {
                localContext = new DurationTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 912;
                this.match(Sql.DURATION);
                this.state = 917;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 77, this.context) ) {
                case 1:
                    {
                    this.state = 913;
                    this.match(Sql.LPAREN);
                    this.state = 914;
                    this.precision();
                    this.state = 915;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            case Sql.ROW:
                {
                localContext = new RowTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 919;
                this.match(Sql.ROW);
                this.state = 920;
                this.match(Sql.LPAREN);
                this.state = 921;
                this.fieldDefinition();
                this.state = 926;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 10) {
                    {
                    {
                    this.state = 922;
                    this.match(Sql.COMMA);
                    this.state = 923;
                    this.fieldDefinition();
                    }
                    }
                    this.state = 928;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 929;
                this.match(Sql.RPAREN);
                }
                break;
            case Sql.OID:
                {
                localContext = new OidTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 931;
                this.match(Sql.OID);
                }
                break;
            case Sql.REGCLASS:
                {
                localContext = new RegClassTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 932;
                this.match(Sql.REGCLASS);
                }
                break;
            case Sql.REGPROC:
                {
                localContext = new RegProcTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 933;
                this.match(Sql.REGPROC);
                }
                break;
            case Sql.KEYWORD:
                {
                localContext = new KeywordTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 934;
                this.match(Sql.KEYWORD);
                }
                break;
            case Sql.UUID:
                {
                localContext = new UuidTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 935;
                this.match(Sql.UUID);
                }
                break;
            case Sql.VARBINARY:
                {
                localContext = new VarbinaryTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 936;
                this.match(Sql.VARBINARY);
                }
                break;
            case Sql.BYTEA:
                {
                localContext = new VarbinaryTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 937;
                this.match(Sql.BYTEA);
                }
                break;
            case Sql.URI:
                {
                localContext = new UriTypeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 938;
                this.match(Sql.URI);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 957;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 83, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 955;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 82, this.context) ) {
                    case 1:
                        {
                        localContext = new ArrayTypeContext(new DataTypeContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_dataType);
                        this.state = 941;
                        if (!(this.precpred(this.context, 2))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 2)");
                        }
                        this.state = 942;
                        this.match(Sql.ARRAY);
                        this.state = 947;
                        this.errorHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this.tokenStream, 80, this.context) ) {
                        case 1:
                            {
                            this.state = 943;
                            this.match(Sql.LBRACK);
                            this.state = 944;
                            this.maximumCardinality();
                            this.state = 945;
                            this.match(Sql.RBRACK);
                            }
                            break;
                        }
                        }
                        break;
                    case 2:
                        {
                        localContext = new ArrayTypeContext(new DataTypeContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_dataType);
                        this.state = 949;
                        if (!(this.precpred(this.context, 1))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 1)");
                        }
                        this.state = 950;
                        this.match(Sql.LBRACK);
                        this.state = 952;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        if (_la === 5) {
                            {
                            this.state = 951;
                            this.maximumCardinality();
                            }
                        }

                        this.state = 954;
                        this.match(Sql.RBRACK);
                        }
                        break;
                    }
                    }
                }
                this.state = 959;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 83, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public precision(): PrecisionContext {
        let localContext = new PrecisionContext(this.context, this.state);
        this.enterRule(localContext, 54, Sql.RULE_precision);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 960;
            this.match(Sql.UNSIGNED_INTEGER);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public scale(): ScaleContext {
        let localContext = new ScaleContext(this.context, this.state);
        this.enterRule(localContext, 56, Sql.RULE_scale);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 962;
            this.match(Sql.UNSIGNED_INTEGER);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public charLengthUnits(): CharLengthUnitsContext {
        let localContext = new CharLengthUnitsContext(this.context, this.state);
        this.enterRule(localContext, 58, Sql.RULE_charLengthUnits);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 964;
            _la = this.tokenStream.LA(1);
            if(!(_la === 82 || _la === 225)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public withOrWithoutTimeZone(): WithOrWithoutTimeZoneContext {
        let localContext = new WithOrWithoutTimeZoneContext(this.context, this.state);
        this.enterRule(localContext, 60, Sql.RULE_withOrWithoutTimeZone);
        try {
            this.state = 978;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.WITH:
                localContext = new WithTimeZoneContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 966;
                this.match(Sql.WITH);
                this.state = 970;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case Sql.TIME:
                    {
                    this.state = 967;
                    this.match(Sql.TIME);
                    this.state = 968;
                    this.match(Sql.ZONE);
                    }
                    break;
                case Sql.TIMEZONE:
                    {
                    this.state = 969;
                    this.match(Sql.TIMEZONE);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            case Sql.WITHOUT:
                localContext = new WithoutTimeZoneContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 972;
                this.match(Sql.WITHOUT);
                this.state = 976;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case Sql.TIME:
                    {
                    this.state = 973;
                    this.match(Sql.TIME);
                    this.state = 974;
                    this.match(Sql.ZONE);
                    }
                    break;
                case Sql.TIMEZONE:
                    {
                    this.state = 975;
                    this.match(Sql.TIMEZONE);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public maximumCardinality(): MaximumCardinalityContext {
        let localContext = new MaximumCardinalityContext(this.context, this.state);
        this.enterRule(localContext, 62, Sql.RULE_maximumCardinality);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 980;
            this.match(Sql.UNSIGNED_INTEGER);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public fieldDefinition(): FieldDefinitionContext {
        let localContext = new FieldDefinitionContext(this.context, this.state);
        this.enterRule(localContext, 64, Sql.RULE_fieldDefinition);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 982;
            localContext._fieldName = this.identifier();
            this.state = 983;
            this.dataType(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public expr(): ExprContext;
    public expr(_p: number): ExprContext;
    public expr(_p?: number): ExprContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ExprContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 66;
        this.enterRecursionRule(localContext, 66, Sql.RULE_expr, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1001;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 89, this.context) ) {
            case 1:
                {
                localContext = new BetweenPredicateContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 986;
                this.commonValueExpr(0);
                this.state = 988;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 216) {
                    {
                    this.state = 987;
                    this.match(Sql.NOT);
                    }
                }

                this.state = 990;
                this.match(Sql.BETWEEN);
                this.state = 992;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 58 || _la === 306) {
                    {
                    this.state = 991;
                    _la = this.tokenStream.LA(1);
                    if(!(_la === 58 || _la === 306)) {
                    this.errorHandler.recoverInline(this);
                    }
                    else {
                        this.errorHandler.reportMatch(this);
                        this.consume();
                    }
                    }
                }

                this.state = 994;
                this.commonValueExpr(0);
                this.state = 995;
                this.match(Sql.AND);
                this.state = 996;
                this.commonValueExpr(0);
                }
                break;
            case 2:
                {
                localContext = new UnaryNotExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 998;
                this.match(Sql.NOT);
                this.state = 999;
                this.expr(4);
                }
                break;
            case 3:
                {
                localContext = new CommonValueExpr0Context(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1000;
                this.commonValueExpr(0);
                }
                break;
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 1131;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 99, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 1129;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 98, this.context) ) {
                    case 1:
                        {
                        localContext = new PeriodOverlapsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1003;
                        if (!(this.precpred(this.context, 26))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 26)");
                        }
                        this.state = 1004;
                        this.match(Sql.OVERLAPS);
                        this.state = 1005;
                        this.expr(27);
                        }
                        break;
                    case 2:
                        {
                        localContext = new PeriodStrictlyOverlapsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1006;
                        if (!(this.precpred(this.context, 25))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 25)");
                        }
                        this.state = 1007;
                        this.match(Sql.STRICTLY);
                        this.state = 1008;
                        this.match(Sql.OVERLAPS);
                        this.state = 1009;
                        this.expr(26);
                        }
                        break;
                    case 3:
                        {
                        localContext = new PeriodEqualsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1010;
                        if (!(this.precpred(this.context, 24))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 24)");
                        }
                        this.state = 1011;
                        this.match(Sql.EQUALS);
                        this.state = 1012;
                        this.expr(25);
                        }
                        break;
                    case 4:
                        {
                        localContext = new PeriodContainsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1013;
                        if (!(this.precpred(this.context, 23))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 23)");
                        }
                        this.state = 1014;
                        this.match(Sql.CONTAINS);
                        this.state = 1015;
                        this.expr(24);
                        }
                        break;
                    case 5:
                        {
                        localContext = new PeriodStrictlyContainsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1016;
                        if (!(this.precpred(this.context, 22))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 22)");
                        }
                        this.state = 1017;
                        this.match(Sql.STRICTLY);
                        this.state = 1018;
                        this.match(Sql.CONTAINS);
                        this.state = 1019;
                        this.expr(23);
                        }
                        break;
                    case 6:
                        {
                        localContext = new PeriodPrecedesPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1020;
                        if (!(this.precpred(this.context, 21))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 21)");
                        }
                        this.state = 1021;
                        this.match(Sql.PRECEDES);
                        this.state = 1022;
                        this.expr(22);
                        }
                        break;
                    case 7:
                        {
                        localContext = new PeriodStrictlyPrecedesPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1023;
                        if (!(this.precpred(this.context, 20))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 20)");
                        }
                        this.state = 1024;
                        this.match(Sql.STRICTLY);
                        this.state = 1025;
                        this.match(Sql.PRECEDES);
                        this.state = 1026;
                        this.expr(21);
                        }
                        break;
                    case 8:
                        {
                        localContext = new PeriodImmediatelyPrecedesPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1027;
                        if (!(this.precpred(this.context, 19))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 19)");
                        }
                        this.state = 1028;
                        this.match(Sql.IMMEDIATELY);
                        this.state = 1029;
                        this.match(Sql.PRECEDES);
                        this.state = 1030;
                        this.expr(20);
                        }
                        break;
                    case 9:
                        {
                        localContext = new PeriodSucceedsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1031;
                        if (!(this.precpred(this.context, 18))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 18)");
                        }
                        this.state = 1032;
                        this.match(Sql.SUCCEEDS);
                        this.state = 1033;
                        this.expr(19);
                        }
                        break;
                    case 10:
                        {
                        localContext = new PeriodStrictlySucceedsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1034;
                        if (!(this.precpred(this.context, 17))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 17)");
                        }
                        this.state = 1035;
                        this.match(Sql.STRICTLY);
                        this.state = 1036;
                        this.match(Sql.SUCCEEDS);
                        this.state = 1037;
                        this.expr(18);
                        }
                        break;
                    case 11:
                        {
                        localContext = new PeriodImmediatelySucceedsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1038;
                        if (!(this.precpred(this.context, 16))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 16)");
                        }
                        this.state = 1039;
                        this.match(Sql.IMMEDIATELY);
                        this.state = 1040;
                        this.match(Sql.SUCCEEDS);
                        this.state = 1041;
                        this.expr(17);
                        }
                        break;
                    case 12:
                        {
                        localContext = new PeriodLagsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1042;
                        if (!(this.precpred(this.context, 15))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 15)");
                        }
                        this.state = 1043;
                        this.match(Sql.LAGS);
                        this.state = 1044;
                        this.expr(16);
                        }
                        break;
                    case 13:
                        {
                        localContext = new PeriodStrictlyLagsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1045;
                        if (!(this.precpred(this.context, 14))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 14)");
                        }
                        this.state = 1046;
                        this.match(Sql.STRICTLY);
                        this.state = 1047;
                        this.match(Sql.LAGS);
                        this.state = 1048;
                        this.expr(15);
                        }
                        break;
                    case 14:
                        {
                        localContext = new PeriodImmediatelyLagsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1049;
                        if (!(this.precpred(this.context, 13))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 13)");
                        }
                        this.state = 1050;
                        this.match(Sql.IMMEDIATELY);
                        this.state = 1051;
                        this.match(Sql.LAGS);
                        this.state = 1052;
                        this.expr(14);
                        }
                        break;
                    case 15:
                        {
                        localContext = new PeriodLeadsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1053;
                        if (!(this.precpred(this.context, 12))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 12)");
                        }
                        this.state = 1054;
                        this.match(Sql.LEADS);
                        this.state = 1055;
                        this.expr(13);
                        }
                        break;
                    case 16:
                        {
                        localContext = new PeriodStrictlyLeadsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1056;
                        if (!(this.precpred(this.context, 11))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 11)");
                        }
                        this.state = 1057;
                        this.match(Sql.STRICTLY);
                        this.state = 1058;
                        this.match(Sql.LEADS);
                        this.state = 1059;
                        this.expr(12);
                        }
                        break;
                    case 17:
                        {
                        localContext = new PeriodImmediatelyLeadsPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1060;
                        if (!(this.precpred(this.context, 10))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 10)");
                        }
                        this.state = 1061;
                        this.match(Sql.IMMEDIATELY);
                        this.state = 1062;
                        this.match(Sql.LEADS);
                        this.state = 1063;
                        this.expr(11);
                        }
                        break;
                    case 18:
                        {
                        localContext = new ComparisonPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1064;
                        if (!(this.precpred(this.context, 9))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 9)");
                        }
                        this.state = 1065;
                        this.compOp();
                        this.state = 1066;
                        this.expr(10);
                        }
                        break;
                    case 19:
                        {
                        localContext = new DistinctFromPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1068;
                        if (!(this.precpred(this.context, 5))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 5)");
                        }
                        this.state = 1069;
                        this.match(Sql.IS);
                        this.state = 1071;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        if (_la === 216) {
                            {
                            this.state = 1070;
                            this.match(Sql.NOT);
                            }
                        }

                        this.state = 1073;
                        this.match(Sql.DISTINCT);
                        this.state = 1074;
                        this.match(Sql.FROM);
                        this.state = 1075;
                        this.expr(6);
                        }
                        break;
                    case 20:
                        {
                        localContext = new AndExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1076;
                        if (!(this.precpred(this.context, 3))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 3)");
                        }
                        this.state = 1077;
                        this.match(Sql.AND);
                        this.state = 1078;
                        this.expr(4);
                        }
                        break;
                    case 21:
                        {
                        localContext = new OrExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1079;
                        if (!(this.precpred(this.context, 2))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 2)");
                        }
                        this.state = 1080;
                        this.match(Sql.OR);
                        this.state = 1081;
                        this.expr(3);
                        }
                        break;
                    case 22:
                        {
                        localContext = new InPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1082;
                        if (!(this.precpred(this.context, 30))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 30)");
                        }
                        this.state = 1084;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        if (_la === 216) {
                            {
                            this.state = 1083;
                            this.match(Sql.NOT);
                            }
                        }

                        this.state = 1086;
                        this.match(Sql.IN);
                        this.state = 1087;
                        this.inPredicateValue();
                        }
                        break;
                    case 23:
                        {
                        localContext = new LikePredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1088;
                        if (!(this.precpred(this.context, 29))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 29)");
                        }
                        this.state = 1090;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        if (_la === 216) {
                            {
                            this.state = 1089;
                            this.match(Sql.NOT);
                            }
                        }

                        this.state = 1092;
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 191 || _la === 192)) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 1093;
                        (localContext as LikePredicateContext)._likePattern = this.commonValueExpr(0);
                        this.state = 1096;
                        this.errorHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this.tokenStream, 93, this.context) ) {
                        case 1:
                            {
                            this.state = 1094;
                            this.match(Sql.ESCAPE);
                            this.state = 1095;
                            (localContext as LikePredicateContext)._likeEscape = this.commonValueExpr(0);
                            }
                            break;
                        }
                        }
                        break;
                    case 24:
                        {
                        localContext = new LikeRegexPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1098;
                        if (!(this.precpred(this.context, 28))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 28)");
                        }
                        this.state = 1100;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        if (_la === 216) {
                            {
                            this.state = 1099;
                            this.match(Sql.NOT);
                            }
                        }

                        this.state = 1102;
                        this.match(Sql.LIKE_REGEX);
                        this.state = 1103;
                        (localContext as LikeRegexPredicateContext)._xqueryPattern = this.commonValueExpr(0);
                        this.state = 1106;
                        this.errorHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this.tokenStream, 95, this.context) ) {
                        case 1:
                            {
                            this.state = 1104;
                            this.match(Sql.FLAG);
                            this.state = 1105;
                            (localContext as LikeRegexPredicateContext)._xqueryOptionFlag = this.commonValueExpr(0);
                            }
                            break;
                        }
                        }
                        break;
                    case 25:
                        {
                        localContext = new PostgresRegexPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1108;
                        if (!(this.precpred(this.context, 27))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 27)");
                        }
                        this.state = 1109;
                        this.postgresRegexOperator();
                        this.state = 1110;
                        (localContext as PostgresRegexPredicateContext)._xqueryPattern = this.commonValueExpr(0);
                        }
                        break;
                    case 26:
                        {
                        localContext = new QuantifiedComparisonPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1112;
                        if (!(this.precpred(this.context, 8))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 8)");
                        }
                        this.state = 1113;
                        this.compOp();
                        this.state = 1114;
                        this.quantifier();
                        this.state = 1115;
                        this.quantifiedComparisonPredicatePart3();
                        }
                        break;
                    case 27:
                        {
                        localContext = new IsBooleanValueExprContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1117;
                        if (!(this.precpred(this.context, 7))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 7)");
                        }
                        this.state = 1118;
                        this.match(Sql.IS);
                        this.state = 1120;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        if (_la === 216) {
                            {
                            this.state = 1119;
                            this.match(Sql.NOT);
                            }
                        }

                        this.state = 1122;
                        this.booleanValue();
                        }
                        break;
                    case 28:
                        {
                        localContext = new NullPredicateContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_expr);
                        this.state = 1123;
                        if (!(this.precpred(this.context, 6))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 6)");
                        }
                        this.state = 1124;
                        this.match(Sql.IS);
                        this.state = 1126;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        if (_la === 216) {
                            {
                            this.state = 1125;
                            this.match(Sql.NOT);
                            }
                        }

                        this.state = 1128;
                        this.match(Sql.NULL);
                        }
                        break;
                    }
                    }
                }
                this.state = 1133;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 99, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }

    public commonValueExpr(): CommonValueExprContext;
    public commonValueExpr(_p: number): CommonValueExprContext;
    public commonValueExpr(_p?: number): CommonValueExprContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new CommonValueExprContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 68;
        this.enterRecursionRule(localContext, 68, Sql.RULE_commonValueExpr, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1634;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 151, this.context) ) {
            case 1:
                {
                localContext = new ScalarSubqueryExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 1135;
                this.subquery();
                }
                break;
            case 2:
                {
                localContext = new WrappedExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1136;
                this.match(Sql.LPAREN);
                this.state = 1137;
                this.expr(0);
                this.state = 1138;
                this.match(Sql.RPAREN);
                }
                break;
            case 3:
                {
                localContext = new LiteralExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1140;
                this.literal();
                }
                break;
            case 4:
                {
                localContext = new UnaryPlusExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1141;
                this.match(Sql.PLUS);
                this.state = 1142;
                this.commonValueExpr(63);
                }
                break;
            case 5:
                {
                localContext = new UnaryMinusExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1143;
                this.match(Sql.MINUS);
                this.state = 1144;
                this.commonValueExpr(62);
                }
                break;
            case 6:
                {
                localContext = new NumericBitwiseNotExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1145;
                this.match(Sql.TILDE);
                this.state = 1146;
                this.commonValueExpr(59);
                }
                break;
            case 7:
                {
                localContext = new ParamExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1147;
                this.parameterSpecification();
                }
                break;
            case 8:
                {
                localContext = new ColumnExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1148;
                this.columnReference();
                }
                break;
            case 9:
                {
                localContext = new AggregateFunctionExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1149;
                this.aggregateFunction();
                }
                break;
            case 10:
                {
                localContext = new WindowFunctionExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1150;
                this.windowFunctionType();
                this.state = 1151;
                this.match(Sql.OVER);
                this.state = 1152;
                this.windowNameOrSpecification();
                }
                break;
            case 11:
                {
                localContext = new NestedWindowFunctionExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1154;
                this.nestedWindowFunction();
                }
                break;
            case 12:
                {
                localContext = new NestOneSubqueryExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1155;
                this.match(Sql.NEST_ONE);
                this.state = 1156;
                this.subquery();
                }
                break;
            case 13:
                {
                localContext = new NestManySubqueryExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1157;
                this.match(Sql.NEST_MANY);
                this.state = 1158;
                this.subquery();
                }
                break;
            case 14:
                {
                localContext = new SimpleCaseExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1159;
                this.match(Sql.CASE);
                this.state = 1160;
                this.expr(0);
                this.state = 1162;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 1161;
                    this.simpleWhenClause();
                    }
                    }
                    this.state = 1164;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 354);
                this.state = 1167;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 124) {
                    {
                    this.state = 1166;
                    this.elseClause();
                    }
                }

                this.state = 1169;
                this.match(Sql.END);
                }
                break;
            case 15:
                {
                localContext = new SearchedCaseExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1171;
                this.match(Sql.CASE);
                this.state = 1173;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 1172;
                    this.searchedWhenClause();
                    }
                    }
                    this.state = 1175;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 354);
                this.state = 1178;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 124) {
                    {
                    this.state = 1177;
                    this.elseClause();
                    }
                }

                this.state = 1180;
                this.match(Sql.END);
                }
                break;
            case 16:
                {
                localContext = new NullIfExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1182;
                this.match(Sql.NULLIF);
                this.state = 1183;
                this.match(Sql.LPAREN);
                this.state = 1184;
                this.expr(0);
                this.state = 1185;
                this.match(Sql.COMMA);
                this.state = 1186;
                this.expr(0);
                this.state = 1187;
                this.match(Sql.RPAREN);
                }
                break;
            case 17:
                {
                localContext = new CoalesceExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1189;
                this.match(Sql.COALESCE);
                this.state = 1190;
                this.match(Sql.LPAREN);
                this.state = 1191;
                this.expr(0);
                this.state = 1196;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 10) {
                    {
                    {
                    this.state = 1192;
                    this.match(Sql.COMMA);
                    this.state = 1193;
                    this.expr(0);
                    }
                    }
                    this.state = 1198;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 1199;
                this.match(Sql.RPAREN);
                }
                break;
            case 18:
                {
                localContext = new CastExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1201;
                this.match(Sql.CAST);
                this.state = 1202;
                this.match(Sql.LPAREN);
                this.state = 1203;
                this.expr(0);
                this.state = 1204;
                this.match(Sql.AS);
                this.state = 1205;
                this.dataType(0);
                this.state = 1206;
                this.match(Sql.RPAREN);
                }
                break;
            case 19:
                {
                localContext = new ArrayExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1208;
                this.arrayValueConstructor();
                }
                break;
            case 20:
                {
                localContext = new ObjectExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1209;
                this.objectConstructor();
                }
                break;
            case 21:
                {
                localContext = new GenerateSeriesFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1210;
                this.generateSeries();
                }
                break;
            case 22:
                {
                localContext = new ExistsPredicateContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1211;
                this.match(Sql.EXISTS);
                this.state = 1212;
                this.subquery();
                }
                break;
            case 23:
                {
                localContext = new HasAnyColumnPrivilegePredicateContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1216;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1213;
                    this.identifier();
                    this.state = 1214;
                    this.match(Sql.DOT);
                    }
                }

                this.state = 1218;
                this.match(Sql.HAS_ANY_COLUMN_PRIVILEGE);
                this.state = 1219;
                this.match(Sql.LPAREN);
                this.state = 1223;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 106, this.context) ) {
                case 1:
                    {
                    this.state = 1220;
                    (localContext as HasAnyColumnPrivilegePredicateContext)._userString = this.expr(0);
                    this.state = 1221;
                    this.match(Sql.COMMA);
                    }
                    break;
                }
                this.state = 1225;
                (localContext as HasAnyColumnPrivilegePredicateContext)._tableString = this.expr(0);
                this.state = 1226;
                this.match(Sql.COMMA);
                this.state = 1227;
                (localContext as HasAnyColumnPrivilegePredicateContext)._privilegeString = this.expr(0);
                this.state = 1228;
                this.match(Sql.RPAREN);
                }
                break;
            case 24:
                {
                localContext = new HasTablePrivilegePredicateContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1233;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1230;
                    this.identifier();
                    this.state = 1231;
                    this.match(Sql.DOT);
                    }
                }

                this.state = 1235;
                this.match(Sql.HAS_TABLE_PRIVILEGE);
                this.state = 1236;
                this.match(Sql.LPAREN);
                this.state = 1240;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 108, this.context) ) {
                case 1:
                    {
                    this.state = 1237;
                    (localContext as HasTablePrivilegePredicateContext)._userString = this.expr(0);
                    this.state = 1238;
                    this.match(Sql.COMMA);
                    }
                    break;
                }
                this.state = 1242;
                (localContext as HasTablePrivilegePredicateContext)._tableString = this.expr(0);
                this.state = 1243;
                this.match(Sql.COMMA);
                this.state = 1244;
                (localContext as HasTablePrivilegePredicateContext)._privilegeString = this.expr(0);
                this.state = 1245;
                this.match(Sql.RPAREN);
                }
                break;
            case 25:
                {
                localContext = new HasSchemaPrivilegePredicateContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1250;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1247;
                    this.identifier();
                    this.state = 1248;
                    this.match(Sql.DOT);
                    }
                }

                this.state = 1252;
                this.match(Sql.HAS_SCHEMA_PRIVILEGE);
                this.state = 1253;
                this.match(Sql.LPAREN);
                this.state = 1257;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 110, this.context) ) {
                case 1:
                    {
                    this.state = 1254;
                    (localContext as HasSchemaPrivilegePredicateContext)._userString = this.expr(0);
                    this.state = 1255;
                    this.match(Sql.COMMA);
                    }
                    break;
                }
                this.state = 1259;
                (localContext as HasSchemaPrivilegePredicateContext)._schemaString = this.expr(0);
                this.state = 1260;
                this.match(Sql.COMMA);
                this.state = 1261;
                (localContext as HasSchemaPrivilegePredicateContext)._privilegeString = this.expr(0);
                this.state = 1262;
                this.match(Sql.RPAREN);
                }
                break;
            case 26:
                {
                localContext = new PostgresVersionFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1267;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 111, this.context) ) {
                case 1:
                    {
                    this.state = 1264;
                    (localContext as PostgresVersionFunctionContext)._schemaName = this.identifier();
                    this.state = 1265;
                    this.match(Sql.DOT);
                    }
                    break;
                }
                this.state = 1269;
                this.match(Sql.VERSION);
                this.state = 1270;
                this.match(Sql.LPAREN);
                this.state = 1271;
                this.match(Sql.RPAREN);
                }
                break;
            case 27:
                {
                localContext = new PostgresGetUserByIdFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1275;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1272;
                    this.identifier();
                    this.state = 1273;
                    this.match(Sql.DOT);
                    }
                }

                this.state = 1277;
                this.match(Sql.PG_GET_USERBYID);
                this.state = 1278;
                this.match(Sql.LPAREN);
                this.state = 1279;
                (localContext as PostgresGetUserByIdFunctionContext)._relOwner = this.columnReference();
                this.state = 1280;
                this.match(Sql.RPAREN);
                }
                break;
            case 28:
                {
                localContext = new PostgresTableIsVisibleFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1285;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1282;
                    this.identifier();
                    this.state = 1283;
                    this.match(Sql.DOT);
                    }
                }

                this.state = 1287;
                this.match(Sql.PG_TABLE_IS_VISIBLE);
                this.state = 1288;
                this.match(Sql.LPAREN);
                this.state = 1289;
                (localContext as PostgresTableIsVisibleFunctionContext)._columnOid = this.columnReference();
                this.state = 1290;
                this.match(Sql.RPAREN);
                }
                break;
            case 29:
                {
                localContext = new PositionFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1292;
                this.match(Sql.POSITION);
                this.state = 1293;
                this.match(Sql.LPAREN);
                this.state = 1294;
                this.expr(0);
                this.state = 1295;
                this.match(Sql.IN);
                this.state = 1296;
                this.expr(0);
                this.state = 1299;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 343) {
                    {
                    this.state = 1297;
                    this.match(Sql.USING);
                    this.state = 1298;
                    this.charLengthUnits();
                    }
                }

                this.state = 1301;
                this.match(Sql.RPAREN);
                }
                break;
            case 30:
                {
                localContext = new ExtractFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1303;
                this.match(Sql.EXTRACT);
                this.state = 1304;
                this.match(Sql.LPAREN);
                this.state = 1305;
                this.extractField();
                this.state = 1306;
                this.match(Sql.FROM);
                this.state = 1307;
                (localContext as ExtractFunctionContext)._extractSource = this.expr(0);
                this.state = 1308;
                this.match(Sql.RPAREN);
                }
                break;
            case 31:
                {
                localContext = new CharacterLengthFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1310;
                _la = this.tokenStream.LA(1);
                if(!(_la === 83 || _la === 84)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 1311;
                this.match(Sql.LPAREN);
                this.state = 1312;
                this.expr(0);
                this.state = 1315;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 343) {
                    {
                    this.state = 1313;
                    this.match(Sql.USING);
                    this.state = 1314;
                    this.charLengthUnits();
                    }
                }

                this.state = 1317;
                this.match(Sql.RPAREN);
                }
                break;
            case 32:
                {
                localContext = new TsTzRangeConstructorContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1319;
                _la = this.tokenStream.LA(1);
                if(!(_la === 244 || _la === 327)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 1320;
                this.match(Sql.LPAREN);
                this.state = 1321;
                this.expr(0);
                this.state = 1322;
                this.match(Sql.COMMA);
                this.state = 1323;
                this.expr(0);
                this.state = 1324;
                this.match(Sql.RPAREN);
                }
                break;
            case 33:
                {
                localContext = new FunctionCallContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1329;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 116, this.context) ) {
                case 1:
                    {
                    this.state = 1326;
                    (localContext as FunctionCallContext)._schemaName = this.identifier();
                    this.state = 1327;
                    this.match(Sql.DOT);
                    }
                    break;
                }
                this.state = 1331;
                (localContext as FunctionCallContext)._fn = this.identifier();
                this.state = 1332;
                this.match(Sql.LPAREN);
                this.state = 1341;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 155894768) !== 0) || ((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & 3421488003) !== 0) || ((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & 3053449013) !== 0) || ((((_la - 118)) & ~0x1F) === 0 && ((1 << (_la - 118)) & 1001673917) !== 0) || ((((_la - 150)) & ~0x1F) === 0 && ((1 << (_la - 150)) & 3514701585) !== 0) || ((((_la - 183)) & ~0x1F) === 0 && ((1 << (_la - 183)) & 1942413451) !== 0) || ((((_la - 216)) & ~0x1F) === 0 && ((1 << (_la - 216)) & 4206915007) !== 0) || ((((_la - 248)) & ~0x1F) === 0 && ((1 << (_la - 248)) & 328981679) !== 0) || ((((_la - 281)) & ~0x1F) === 0 && ((1 << (_la - 281)) & 4249790709) !== 0) || ((((_la - 315)) & ~0x1F) === 0 && ((1 << (_la - 315)) & 1878810127) !== 0) || ((((_la - 347)) & ~0x1F) === 0 && ((1 << (_la - 347)) & 950399) !== 0)) {
                    {
                    this.state = 1333;
                    this.expr(0);
                    this.state = 1338;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 10) {
                        {
                        {
                        this.state = 1334;
                        this.match(Sql.COMMA);
                        this.state = 1335;
                        this.expr(0);
                        }
                        }
                        this.state = 1340;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    }
                }

                this.state = 1343;
                this.match(Sql.RPAREN);
                }
                break;
            case 34:
                {
                localContext = new CharacterSubstringFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1345;
                this.match(Sql.SUBSTRING);
                this.state = 1346;
                this.match(Sql.LPAREN);
                this.state = 1347;
                (localContext as CharacterSubstringFunctionContext)._substringSource = this.expr(0);
                this.state = 1368;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case Sql.UNSIGNED_FLOAT:
                case Sql.UNSIGNED_INTEGER:
                case Sql.CHARACTER_STRING:
                case Sql.C_ESCAPES_STRING:
                case Sql.BINARY_STRING:
                case Sql.POSTGRES_PARAMETER_SPECIFICATION:
                case Sql.QUESTION:
                case Sql.LPAREN:
                case Sql.LBRACK:
                case Sql.LBRACE:
                case Sql.TILDE:
                case Sql.PLUS:
                case Sql.MINUS:
                case Sql.ARRAY:
                case Sql.ARRAY_AGG:
                case Sql.AT:
                case Sql.ATTACH:
                case Sql.AVG:
                case Sql.BETWEEN:
                case Sql.BIGINT:
                case Sql.BOOL:
                case Sql.BOOLEAN:
                case Sql.BOOL_AND:
                case Sql.BOOL_OR:
                case Sql.BPCHAR:
                case Sql.BY:
                case Sql.BYTEA:
                case Sql.CASE:
                case Sql.CAST:
                case Sql.CHAR:
                case Sql.CHARACTER_LENGTH:
                case Sql.CHAR_LENGTH:
                case Sql.COALESCE:
                case Sql.COMMITTED:
                case Sql.COPY:
                case Sql.COUNT:
                case Sql.CUME_DIST:
                case Sql.CURRENT:
                case Sql.CURRENT_CATALOG:
                case Sql.CURRENT_DATE:
                case Sql.CURRENT_SCHEMA:
                case Sql.CURRENT_SCHEMAS:
                case Sql.CURRENT_SETTING:
                case Sql.CURRENT_TIME:
                case Sql.CURRENT_TIMESTAMP:
                case Sql.CURRENT_USER:
                case Sql.DATABASE:
                case Sql.DATE:
                case Sql.DATE_BIN:
                case Sql.DATE_TRUNC:
                case Sql.DAY:
                case Sql.DEC:
                case Sql.DECIMAL:
                case Sql.DELETE:
                case Sql.DENSE_RANK:
                case Sql.DETACH:
                case Sql.DISCARD:
                case Sql.DOUBLE:
                case Sql.DOW:
                case Sql.DOY:
                case Sql.DURATION:
                case Sql.END:
                case Sql.EPOCH:
                case Sql.ERASE:
                case Sql.EVERY:
                case Sql.EXISTS:
                case Sql.EXTRACT:
                case Sql.FALSE:
                case Sql.FILTER:
                case Sql.FIRST:
                case Sql.FIRST_VALUE:
                case Sql.FLOAT:
                case Sql.FLOAT4:
                case Sql.FLOAT8:
                case Sql.FORMAT:
                case Sql.FROM:
                case Sql.GENERATE_SERIES:
                case Sql.HAS_ANY_COLUMN_PRIVILEGE:
                case Sql.HAS_SCHEMA_PRIVILEGE:
                case Sql.HAS_TABLE_PRIVILEGE:
                case Sql.HOUR:
                case Sql.INSERT:
                case Sql.INT:
                case Sql.INT2:
                case Sql.INT4:
                case Sql.INT8:
                case Sql.INTEGER:
                case Sql.INTERVAL:
                case Sql.ISODOW:
                case Sql.KEYWORD:
                case Sql.LAG:
                case Sql.LAST:
                case Sql.LAST_VALUE:
                case Sql.LEAD:
                case Sql.LEVEL:
                case Sql.LOCAL_DATE:
                case Sql.LOCAL_TIME:
                case Sql.LOCAL_TIMESTAMP:
                case Sql.MAX:
                case Sql.METADATA:
                case Sql.MIN:
                case Sql.MINUTE:
                case Sql.MONTH:
                case Sql.NAME:
                case Sql.NEST_MANY:
                case Sql.NEST_ONE:
                case Sql.NEXT:
                case Sql.NOT:
                case Sql.NOW:
                case Sql.NTH_VALUE:
                case Sql.NTILE:
                case Sql.NULL:
                case Sql.NULLIF:
                case Sql.NUMERIC:
                case Sql.OBJECT:
                case Sql.OF:
                case Sql.OFF:
                case Sql.OID:
                case Sql.ON:
                case Sql.OVERLAPS:
                case Sql.OVERLAY:
                case Sql.PASSWORD:
                case Sql.PERCENT_RANK:
                case Sql.PERIOD:
                case Sql.PG_EXPANDARRAY:
                case Sql.PG_GET_EXPR:
                case Sql.PG_GET_INDEXDEF:
                case Sql.PG_GET_USERBYID:
                case Sql.PG_SLEEP:
                case Sql.PG_SLEEP_FOR:
                case Sql.PG_TABLE_IS_VISIBLE:
                case Sql.PLANS:
                case Sql.POSITION:
                case Sql.PERCENTILE_CONT:
                case Sql.PERCENTILE_DISC:
                case Sql.PRECISION:
                case Sql.QUARTER:
                case Sql.RANGE:
                case Sql.RANGE_BINS:
                case Sql.RANK:
                case Sql.REAL:
                case Sql.RECORD:
                case Sql.REGCLASS:
                case Sql.REGEXP_REPLACE:
                case Sql.REGPROC:
                case Sql.REPLACE:
                case Sql.ROLE:
                case Sql.ROW:
                case Sql.ROW_NUMBER:
                case Sql.SECOND:
                case Sql.SELECT:
                case Sql.SEQUENCES:
                case Sql.SETTING:
                case Sql.SMALLINT:
                case Sql.SNAPSHOT_TOKEN:
                case Sql.START:
                case Sql.STDDEV_POP:
                case Sql.STDDEV_SAMP:
                case Sql.SUBSTRING:
                case Sql.SUM:
                case Sql.SYNC:
                case Sql.SYSTEM_TIME:
                case Sql.TABLE:
                case Sql.TEMP:
                case Sql.TEMPORARY:
                case Sql.TEXT:
                case Sql.TIME:
                case Sql.TIMESTAMP:
                case Sql.TIMESTAMPTZ:
                case Sql.TIMEZONE:
                case Sql.TRIM:
                case Sql.TRIM_ARRAY:
                case Sql.TRUE:
                case Sql.TSTZRANGE:
                case Sql.UNCOMMITTED:
                case Sql.UPDATE:
                case Sql.URI:
                case Sql.URI_FRAGMENT:
                case Sql.URI_HOST:
                case Sql.URI_PATH:
                case Sql.URI_PORT:
                case Sql.URI_QUERY:
                case Sql.URI_SCHEME:
                case Sql.URI_USER_INFO:
                case Sql.USER:
                case Sql.UUID:
                case Sql.VALID_TIME:
                case Sql.VALUE_OF:
                case Sql.VARCHAR:
                case Sql.VAR_POP:
                case Sql.VAR_SAMP:
                case Sql.VARBINARY:
                case Sql.VERSION:
                case Sql.WEEK:
                case Sql.YEAR:
                case Sql.DOLLAR_TAG:
                case Sql.REGULAR_IDENTIFIER:
                case Sql.DELIMITED_IDENTIFIER:
                    {
                    this.state = 1349;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 152) {
                        {
                        this.state = 1348;
                        this.match(Sql.FROM);
                        }
                    }

                    this.state = 1351;
                    (localContext as CharacterSubstringFunctionContext)._startPosition = this.expr(0);
                    this.state = 1356;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 155894768) !== 0) || ((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & 3421488003) !== 0) || ((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & 3053449013) !== 0) || ((((_la - 118)) & ~0x1F) === 0 && ((1 << (_la - 118)) & 3149157565) !== 0) || ((((_la - 150)) & ~0x1F) === 0 && ((1 << (_la - 150)) & 3514701585) !== 0) || ((((_la - 183)) & ~0x1F) === 0 && ((1 << (_la - 183)) & 1942413451) !== 0) || ((((_la - 216)) & ~0x1F) === 0 && ((1 << (_la - 216)) & 4206915007) !== 0) || ((((_la - 248)) & ~0x1F) === 0 && ((1 << (_la - 248)) & 328981679) !== 0) || ((((_la - 281)) & ~0x1F) === 0 && ((1 << (_la - 281)) & 4249790709) !== 0) || ((((_la - 315)) & ~0x1F) === 0 && ((1 << (_la - 315)) & 1878810127) !== 0) || ((((_la - 347)) & ~0x1F) === 0 && ((1 << (_la - 347)) & 950399) !== 0)) {
                        {
                        this.state = 1353;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        if (_la === 149) {
                            {
                            this.state = 1352;
                            this.match(Sql.FOR);
                            }
                        }

                        this.state = 1355;
                        (localContext as CharacterSubstringFunctionContext)._stringLength = this.expr(0);
                        }
                    }

                    this.state = 1360;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 343) {
                        {
                        this.state = 1358;
                        this.match(Sql.USING);
                        this.state = 1359;
                        this.charLengthUnits();
                        }
                    }

                    }
                    break;
                case Sql.COMMA:
                    {
                    this.state = 1362;
                    this.match(Sql.COMMA);
                    this.state = 1363;
                    (localContext as CharacterSubstringFunctionContext)._startPosition = this.expr(0);
                    this.state = 1366;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 10) {
                        {
                        this.state = 1364;
                        this.match(Sql.COMMA);
                        this.state = 1365;
                        (localContext as CharacterSubstringFunctionContext)._stringLength = this.expr(0);
                        }
                    }

                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                this.state = 1370;
                this.match(Sql.RPAREN);
                }
                break;
            case 35:
                {
                localContext = new TrimFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1372;
                this.match(Sql.TRIM);
                this.state = 1373;
                this.match(Sql.LPAREN);
                this.state = 1375;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 73 || _la === 188 || _la === 322) {
                    {
                    this.state = 1374;
                    this.trimSpecification();
                    }
                }

                this.state = 1384;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 126, this.context) ) {
                case 1:
                    {
                    this.state = 1377;
                    (localContext as TrimFunctionContext)._trimCharacter = this.expr(0);
                    this.state = 1378;
                    this.match(Sql.FROM);
                    this.state = 1379;
                    (localContext as TrimFunctionContext)._trimSource = this.expr(0);
                    }
                    break;
                case 2:
                    {
                    this.state = 1381;
                    this.match(Sql.FROM);
                    this.state = 1382;
                    (localContext as TrimFunctionContext)._trimSource = this.expr(0);
                    }
                    break;
                case 3:
                    {
                    this.state = 1383;
                    (localContext as TrimFunctionContext)._trimSource = this.expr(0);
                    }
                    break;
                }
                this.state = 1386;
                this.match(Sql.RPAREN);
                }
                break;
            case 36:
                {
                localContext = new UriSchemeFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1388;
                this.match(Sql.URI_SCHEME);
                this.state = 1389;
                this.match(Sql.LPAREN);
                this.state = 1390;
                this.expr(0);
                this.state = 1391;
                this.match(Sql.RPAREN);
                }
                break;
            case 37:
                {
                localContext = new UriUserInfoFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1393;
                this.match(Sql.URI_USER_INFO);
                this.state = 1394;
                this.match(Sql.LPAREN);
                this.state = 1395;
                this.expr(0);
                this.state = 1396;
                this.match(Sql.RPAREN);
                }
                break;
            case 38:
                {
                localContext = new UriHostFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1398;
                this.match(Sql.URI_HOST);
                this.state = 1399;
                this.match(Sql.LPAREN);
                this.state = 1400;
                this.expr(0);
                this.state = 1401;
                this.match(Sql.RPAREN);
                }
                break;
            case 39:
                {
                localContext = new UriPortFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1403;
                this.match(Sql.URI_PORT);
                this.state = 1404;
                this.match(Sql.LPAREN);
                this.state = 1405;
                this.expr(0);
                this.state = 1406;
                this.match(Sql.RPAREN);
                }
                break;
            case 40:
                {
                localContext = new UriPathFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1408;
                this.match(Sql.URI_PATH);
                this.state = 1409;
                this.match(Sql.LPAREN);
                this.state = 1410;
                this.expr(0);
                this.state = 1411;
                this.match(Sql.RPAREN);
                }
                break;
            case 41:
                {
                localContext = new UriQueryFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1413;
                this.match(Sql.URI_QUERY);
                this.state = 1414;
                this.match(Sql.LPAREN);
                this.state = 1415;
                this.expr(0);
                this.state = 1416;
                this.match(Sql.RPAREN);
                }
                break;
            case 42:
                {
                localContext = new UriFragmentFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1418;
                this.match(Sql.URI_FRAGMENT);
                this.state = 1419;
                this.match(Sql.LPAREN);
                this.state = 1420;
                this.expr(0);
                this.state = 1421;
                this.match(Sql.RPAREN);
                }
                break;
            case 43:
                {
                localContext = new OverlayFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1423;
                this.match(Sql.OVERLAY);
                this.state = 1424;
                this.match(Sql.LPAREN);
                this.state = 1425;
                this.expr(0);
                this.state = 1426;
                this.match(Sql.PLACING);
                this.state = 1427;
                this.expr(0);
                this.state = 1428;
                this.match(Sql.FROM);
                this.state = 1429;
                (localContext as OverlayFunctionContext)._startPosition = this.expr(0);
                this.state = 1432;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 149) {
                    {
                    this.state = 1430;
                    this.match(Sql.FOR);
                    this.state = 1431;
                    (localContext as OverlayFunctionContext)._stringLength = this.expr(0);
                    }
                }

                this.state = 1436;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 343) {
                    {
                    this.state = 1434;
                    this.match(Sql.USING);
                    this.state = 1435;
                    this.charLengthUnits();
                    }
                }

                this.state = 1438;
                this.match(Sql.RPAREN);
                }
                break;
            case 44:
                {
                localContext = new ReplaceFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1440;
                this.match(Sql.REPLACE);
                this.state = 1441;
                this.match(Sql.LPAREN);
                this.state = 1442;
                (localContext as ReplaceFunctionContext)._source = this.expr(0);
                this.state = 1443;
                this.match(Sql.COMMA);
                this.state = 1444;
                (localContext as ReplaceFunctionContext)._pattern = this.expr(0);
                this.state = 1445;
                this.match(Sql.COMMA);
                this.state = 1446;
                (localContext as ReplaceFunctionContext)._replacement = this.expr(0);
                this.state = 1447;
                this.match(Sql.RPAREN);
                }
                break;
            case 45:
                {
                localContext = new RegexpReplaceFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1449;
                this.match(Sql.REGEXP_REPLACE);
                this.state = 1450;
                this.match(Sql.LPAREN);
                this.state = 1451;
                (localContext as RegexpReplaceFunctionContext)._source = this.expr(0);
                this.state = 1452;
                this.match(Sql.COMMA);
                this.state = 1453;
                (localContext as RegexpReplaceFunctionContext)._pattern = this.characterString();
                this.state = 1454;
                this.match(Sql.COMMA);
                this.state = 1455;
                (localContext as RegexpReplaceFunctionContext)._replacement = this.characterString();
                this.state = 1462;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 130, this.context) ) {
                case 1:
                    {
                    this.state = 1456;
                    this.match(Sql.COMMA);
                    this.state = 1457;
                    (localContext as RegexpReplaceFunctionContext)._start = this.integerLiteral();
                    this.state = 1460;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 129, this.context) ) {
                    case 1:
                        {
                        this.state = 1458;
                        this.match(Sql.COMMA);
                        this.state = 1459;
                        (localContext as RegexpReplaceFunctionContext)._n = this.integerLiteral();
                        }
                        break;
                    }
                    }
                    break;
                }
                this.state = 1466;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 10) {
                    {
                    this.state = 1464;
                    this.match(Sql.COMMA);
                    this.state = 1465;
                    (localContext as RegexpReplaceFunctionContext)._flags = this.characterString();
                    }
                }

                this.state = 1468;
                this.match(Sql.RPAREN);
                }
                break;
            case 46:
                {
                localContext = new CurrentUserFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1473;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1470;
                    this.identifier();
                    this.state = 1471;
                    this.match(Sql.DOT);
                    }
                }

                this.state = 1475;
                this.match(Sql.CURRENT_USER);
                }
                break;
            case 47:
                {
                localContext = new CurrentSchemaFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1479;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1476;
                    this.identifier();
                    this.state = 1477;
                    this.match(Sql.DOT);
                    }
                }

                this.state = 1481;
                this.match(Sql.CURRENT_SCHEMA);
                this.state = 1484;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 134, this.context) ) {
                case 1:
                    {
                    this.state = 1482;
                    this.match(Sql.LPAREN);
                    this.state = 1483;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            case 48:
                {
                localContext = new CurrentSchemasFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1489;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1486;
                    this.identifier();
                    this.state = 1487;
                    this.match(Sql.DOT);
                    }
                }

                this.state = 1491;
                this.match(Sql.CURRENT_SCHEMAS);
                this.state = 1492;
                this.match(Sql.LPAREN);
                this.state = 1493;
                this.expr(0);
                this.state = 1494;
                this.match(Sql.RPAREN);
                }
                break;
            case 49:
                {
                localContext = new CurrentCatalogFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1499;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1496;
                    this.identifier();
                    this.state = 1497;
                    this.match(Sql.DOT);
                    }
                }

                this.state = 1501;
                this.match(Sql.CURRENT_CATALOG);
                this.state = 1504;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 137, this.context) ) {
                case 1:
                    {
                    this.state = 1502;
                    this.match(Sql.LPAREN);
                    this.state = 1503;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            case 50:
                {
                localContext = new PgGetExprFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1509;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1506;
                    this.identifier();
                    this.state = 1507;
                    this.match(Sql.DOT);
                    }
                }

                this.state = 1511;
                this.match(Sql.PG_GET_EXPR);
                this.state = 1522;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 140, this.context) ) {
                case 1:
                    {
                    this.state = 1512;
                    this.match(Sql.LPAREN);
                    this.state = 1513;
                    this.expr(0);
                    this.state = 1514;
                    this.match(Sql.COMMA);
                    this.state = 1515;
                    this.expr(0);
                    this.state = 1518;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 10) {
                        {
                        this.state = 1516;
                        this.match(Sql.COMMA);
                        this.state = 1517;
                        this.expr(0);
                        }
                    }

                    this.state = 1520;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            case 51:
                {
                localContext = new PgExpandArrayFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1527;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1524;
                    this.identifier();
                    this.state = 1525;
                    this.match(Sql.DOT);
                    }
                }

                this.state = 1529;
                this.match(Sql.PG_EXPANDARRAY);
                this.state = 1534;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 142, this.context) ) {
                case 1:
                    {
                    this.state = 1530;
                    this.match(Sql.LPAREN);
                    this.state = 1531;
                    this.expr(0);
                    this.state = 1532;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            case 52:
                {
                localContext = new PgGetIndexdefFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1539;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1536;
                    this.identifier();
                    this.state = 1537;
                    this.match(Sql.DOT);
                    }
                }

                this.state = 1541;
                this.match(Sql.PG_GET_INDEXDEF);
                this.state = 1542;
                this.match(Sql.LPAREN);
                this.state = 1543;
                this.expr(0);
                this.state = 1549;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 10) {
                    {
                    this.state = 1544;
                    this.match(Sql.COMMA);
                    this.state = 1545;
                    this.expr(0);
                    this.state = 1546;
                    this.match(Sql.COMMA);
                    this.state = 1547;
                    this.expr(0);
                    }
                }

                this.state = 1551;
                this.match(Sql.RPAREN);
                }
                break;
            case 53:
                {
                localContext = new PgSleepFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1553;
                this.match(Sql.PG_SLEEP);
                this.state = 1554;
                this.match(Sql.LPAREN);
                this.state = 1555;
                (localContext as PgSleepFunctionContext)._sleepSeconds = this.expr(0);
                this.state = 1556;
                this.match(Sql.RPAREN);
                }
                break;
            case 54:
                {
                localContext = new PgSleepForFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1558;
                this.match(Sql.PG_SLEEP_FOR);
                this.state = 1559;
                this.match(Sql.LPAREN);
                this.state = 1560;
                (localContext as PgSleepForFunctionContext)._sleepPeriod = this.expr(0);
                this.state = 1561;
                this.match(Sql.RPAREN);
                }
                break;
            case 55:
                {
                localContext = new CurrentInstantFunction0Context(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1563;
                this.currentInstantFunction();
                }
                break;
            case 56:
                {
                localContext = new CurrentSettingFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1564;
                this.match(Sql.CURRENT_SETTING);
                this.state = 1565;
                this.match(Sql.LPAREN);
                this.state = 1566;
                this.expr(0);
                this.state = 1567;
                this.match(Sql.RPAREN);
                }
                break;
            case 57:
                {
                localContext = new CurrentTimeFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1569;
                this.match(Sql.CURRENT_TIME);
                this.state = 1574;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 145, this.context) ) {
                case 1:
                    {
                    this.state = 1570;
                    this.match(Sql.LPAREN);
                    this.state = 1571;
                    this.precision();
                    this.state = 1572;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            case 58:
                {
                localContext = new LocalTimeFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1576;
                this.match(Sql.LOCAL_TIME);
                this.state = 1581;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 146, this.context) ) {
                case 1:
                    {
                    this.state = 1577;
                    this.match(Sql.LPAREN);
                    this.state = 1578;
                    this.precision();
                    this.state = 1579;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            case 59:
                {
                localContext = new DateTruncFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1583;
                this.match(Sql.DATE_TRUNC);
                this.state = 1584;
                this.match(Sql.LPAREN);
                this.state = 1585;
                this.dateTruncPrecision();
                this.state = 1586;
                this.match(Sql.COMMA);
                this.state = 1587;
                (localContext as DateTruncFunctionContext)._dateTruncSource = this.expr(0);
                this.state = 1590;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 10) {
                    {
                    this.state = 1588;
                    this.match(Sql.COMMA);
                    this.state = 1589;
                    (localContext as DateTruncFunctionContext)._dateTruncTimeZone = this.characterString();
                    }
                }

                this.state = 1592;
                this.match(Sql.RPAREN);
                }
                break;
            case 60:
                {
                localContext = new DateBinFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1594;
                this.match(Sql.DATE_BIN);
                this.state = 1595;
                this.match(Sql.LPAREN);
                this.state = 1596;
                this.intervalLiteral();
                this.state = 1597;
                this.match(Sql.COMMA);
                this.state = 1598;
                (localContext as DateBinFunctionContext)._dateBinSource = this.expr(0);
                this.state = 1601;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 10) {
                    {
                    this.state = 1599;
                    this.match(Sql.COMMA);
                    this.state = 1600;
                    (localContext as DateBinFunctionContext)._dateBinOrigin = this.expr(0);
                    }
                }

                this.state = 1603;
                this.match(Sql.RPAREN);
                }
                break;
            case 61:
                {
                localContext = new RangeBinsFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1605;
                this.match(Sql.RANGE_BINS);
                this.state = 1606;
                this.match(Sql.LPAREN);
                this.state = 1607;
                this.intervalLiteral();
                this.state = 1608;
                this.match(Sql.COMMA);
                this.state = 1609;
                (localContext as RangeBinsFunctionContext)._rangeBinsSource = this.expr(0);
                this.state = 1612;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 10) {
                    {
                    this.state = 1610;
                    this.match(Sql.COMMA);
                    this.state = 1611;
                    (localContext as RangeBinsFunctionContext)._dateBinOrigin = this.expr(0);
                    }
                }

                this.state = 1614;
                this.match(Sql.RPAREN);
                }
                break;
            case 62:
                {
                localContext = new OverlapsFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1616;
                this.match(Sql.OVERLAPS);
                this.state = 1617;
                this.match(Sql.LPAREN);
                this.state = 1618;
                this.expr(0);
                this.state = 1621;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 1619;
                    this.match(Sql.COMMA);
                    this.state = 1620;
                    this.expr(0);
                    }
                    }
                    this.state = 1623;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 10);
                this.state = 1625;
                this.match(Sql.RPAREN);
                }
                break;
            case 63:
                {
                localContext = new TrimArrayFunctionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 1627;
                this.match(Sql.TRIM_ARRAY);
                this.state = 1628;
                this.match(Sql.LPAREN);
                this.state = 1629;
                this.expr(0);
                this.state = 1630;
                this.match(Sql.COMMA);
                this.state = 1631;
                this.expr(0);
                this.state = 1632;
                this.match(Sql.RPAREN);
                }
                break;
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 1661;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 153, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 1659;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 152, this.context) ) {
                    case 1:
                        {
                        localContext = new JsonAccessExprContext(new CommonValueExprContext(parentContext, parentState));
                        (localContext as JsonAccessExprContext)._obj = previousContext;
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_commonValueExpr);
                        this.state = 1636;
                        if (!(this.precpred(this.context, 64))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 64)");
                        }
                        this.state = 1637;
                        (localContext as JsonAccessExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 25)) & ~0x1F) === 0 && ((1 << (_la - 25)) & 387) !== 0))) {
                            (localContext as JsonAccessExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 1638;
                        (localContext as JsonAccessExprContext)._arg = this.commonValueExpr(65);
                        }
                        break;
                    case 2:
                        {
                        localContext = new NumericFactorExprContext(new CommonValueExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_commonValueExpr);
                        this.state = 1639;
                        if (!(this.precpred(this.context, 61))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 61)");
                        }
                        this.state = 1640;
                        _la = this.tokenStream.LA(1);
                        if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 1879048192) !== 0))) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 1641;
                        this.commonValueExpr(62);
                        }
                        break;
                    case 3:
                        {
                        localContext = new NumericTermExprContext(new CommonValueExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_commonValueExpr);
                        this.state = 1642;
                        if (!(this.precpred(this.context, 60))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 60)");
                        }
                        this.state = 1643;
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 24 || _la === 27)) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 1644;
                        this.commonValueExpr(61);
                        }
                        break;
                    case 4:
                        {
                        localContext = new ConcatOrBitwiseExprContext(new CommonValueExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_commonValueExpr);
                        this.state = 1645;
                        if (!(this.precpred(this.context, 58))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 58)");
                        }
                        this.state = 1646;
                        (localContext as ConcatOrBitwiseExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 21)) & ~0x1F) === 0 && ((1 << (_la - 21)) & 58373) !== 0))) {
                            (localContext as ConcatOrBitwiseExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 1647;
                        this.commonValueExpr(59);
                        }
                        break;
                    case 5:
                        {
                        localContext = new FieldAccessContext(new CommonValueExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_commonValueExpr);
                        this.state = 1648;
                        if (!(this.precpred(this.context, 67))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 67)");
                        }
                        this.state = 1649;
                        this.match(Sql.DOT);
                        this.state = 1650;
                        (localContext as FieldAccessContext)._fieldName = this.identifier();
                        }
                        break;
                    case 6:
                        {
                        localContext = new ArrayAccessContext(new CommonValueExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_commonValueExpr);
                        this.state = 1651;
                        if (!(this.precpred(this.context, 66))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 66)");
                        }
                        this.state = 1652;
                        this.match(Sql.LBRACK);
                        this.state = 1653;
                        this.expr(0);
                        this.state = 1654;
                        this.match(Sql.RBRACK);
                        }
                        break;
                    case 7:
                        {
                        localContext = new PostgresCastExprContext(new CommonValueExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_commonValueExpr);
                        this.state = 1656;
                        if (!(this.precpred(this.context, 65))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 65)");
                        }
                        this.state = 1657;
                        this.match(Sql.PG_CAST);
                        this.state = 1658;
                        this.dataType(0);
                        }
                        break;
                    }
                    }
                }
                this.state = 1663;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 153, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public currentInstantFunction(): CurrentInstantFunctionContext {
        let localContext = new CurrentInstantFunctionContext(this.context, this.state);
        this.enterRule(localContext, 70, Sql.RULE_currentInstantFunction);
        let _la: number;
        try {
            this.state = 1694;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.CURRENT_DATE:
                localContext = new CurrentDateFunctionContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1664;
                this.match(Sql.CURRENT_DATE);
                this.state = 1667;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 154, this.context) ) {
                case 1:
                    {
                    this.state = 1665;
                    this.match(Sql.LPAREN);
                    this.state = 1666;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            case Sql.CURRENT_TIMESTAMP:
            case Sql.NOW:
                localContext = new CurrentTimestampFunctionContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1669;
                _la = this.tokenStream.LA(1);
                if(!(_la === 103 || _la === 217)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 1675;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 156, this.context) ) {
                case 1:
                    {
                    this.state = 1670;
                    this.match(Sql.LPAREN);
                    this.state = 1672;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 5) {
                        {
                        this.state = 1671;
                        this.precision();
                        }
                    }

                    this.state = 1674;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            case Sql.SNAPSHOT_TOKEN:
                localContext = new SnapshotTokenFunctionContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 1677;
                this.match(Sql.SNAPSHOT_TOKEN);
                this.state = 1680;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 157, this.context) ) {
                case 1:
                    {
                    this.state = 1678;
                    this.match(Sql.LPAREN);
                    this.state = 1679;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            case Sql.LOCAL_DATE:
                localContext = new LocalDateFunctionContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 1682;
                this.match(Sql.LOCAL_DATE);
                this.state = 1685;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 158, this.context) ) {
                case 1:
                    {
                    this.state = 1683;
                    this.match(Sql.LPAREN);
                    this.state = 1684;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            case Sql.LOCAL_TIMESTAMP:
                localContext = new LocalTimestampFunctionContext(localContext);
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 1687;
                this.match(Sql.LOCAL_TIMESTAMP);
                this.state = 1692;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 159, this.context) ) {
                case 1:
                    {
                    this.state = 1688;
                    this.match(Sql.LPAREN);
                    this.state = 1689;
                    this.precision();
                    this.state = 1690;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public booleanValue(): BooleanValueContext {
        let localContext = new BooleanValueContext(this.context, this.state);
        this.enterRule(localContext, 72, Sql.RULE_booleanValue);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1696;
            _la = this.tokenStream.LA(1);
            if(!(_la === 139 || _la === 326 || _la === 331)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public objectConstructor(): ObjectConstructorContext {
        let localContext = new ObjectConstructorContext(this.context, this.state);
        this.enterRule(localContext, 74, Sql.RULE_objectConstructor);
        let _la: number;
        try {
            this.state = 1723;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.OBJECT:
            case Sql.RECORD:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1698;
                _la = this.tokenStream.LA(1);
                if(!(_la === 224 || _la === 268)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 1699;
                this.match(Sql.LPAREN);
                this.state = 1708;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1700;
                    this.objectNameAndValue();
                    this.state = 1705;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 10) {
                        {
                        {
                        this.state = 1701;
                        this.match(Sql.COMMA);
                        this.state = 1702;
                        this.objectNameAndValue();
                        }
                        }
                        this.state = 1707;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    }
                }

                this.state = 1710;
                this.match(Sql.RPAREN);
                }
                break;
            case Sql.LBRACE:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1711;
                this.match(Sql.LBRACE);
                this.state = 1720;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                    {
                    this.state = 1712;
                    this.objectNameAndValue();
                    this.state = 1717;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 10) {
                        {
                        {
                        this.state = 1713;
                        this.match(Sql.COMMA);
                        this.state = 1714;
                        this.objectNameAndValue();
                        }
                        }
                        this.state = 1719;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    }
                }

                this.state = 1722;
                this.match(Sql.RBRACE);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public objectNameAndValue(): ObjectNameAndValueContext {
        let localContext = new ObjectNameAndValueContext(this.context, this.state);
        this.enterRule(localContext, 76, Sql.RULE_objectNameAndValue);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1725;
            localContext._objectName = this.identifier();
            this.state = 1726;
            this.match(Sql.COLON);
            this.state = 1727;
            this.expr(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public parameterSpecification(): ParameterSpecificationContext {
        let localContext = new ParameterSpecificationContext(this.context, this.state);
        this.enterRule(localContext, 78, Sql.RULE_parameterSpecification);
        try {
            this.state = 1731;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.QUESTION:
                localContext = new DynamicParameterContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1729;
                this.match(Sql.QUESTION);
                }
                break;
            case Sql.POSTGRES_PARAMETER_SPECIFICATION:
                localContext = new PostgresParameterContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1730;
                this.match(Sql.POSTGRES_PARAMETER_SPECIFICATION);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public staticExpr(): StaticExprContext {
        let localContext = new StaticExprContext(this.context, this.state);
        this.enterRule(localContext, 80, Sql.RULE_staticExpr);
        try {
            this.state = 1735;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.UNSIGNED_FLOAT:
            case Sql.UNSIGNED_INTEGER:
            case Sql.CHARACTER_STRING:
            case Sql.C_ESCAPES_STRING:
            case Sql.BINARY_STRING:
            case Sql.PLUS:
            case Sql.MINUS:
            case Sql.DATE:
            case Sql.DURATION:
            case Sql.FALSE:
            case Sql.INTERVAL:
            case Sql.KEYWORD:
            case Sql.NULL:
            case Sql.OFF:
            case Sql.ON:
            case Sql.TIME:
            case Sql.TIMESTAMP:
            case Sql.TRUE:
            case Sql.URI:
            case Sql.UUID:
            case Sql.DOLLAR_TAG:
                localContext = new StaticLiteralContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1733;
                this.literal();
                }
                break;
            case Sql.POSTGRES_PARAMETER_SPECIFICATION:
            case Sql.QUESTION:
                localContext = new StaticParamContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1734;
                this.parameterSpecification();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public columnReference(): ColumnReferenceContext {
        let localContext = new ColumnReferenceContext(this.context, this.state);
        this.enterRule(localContext, 82, Sql.RULE_columnReference);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1737;
            this.identifierChain();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public generateSeries(): GenerateSeriesContext {
        let localContext = new GenerateSeriesContext(this.context, this.state);
        this.enterRule(localContext, 84, Sql.RULE_generateSeries);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1742;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                {
                this.state = 1739;
                this.identifier();
                this.state = 1740;
                this.match(Sql.DOT);
                }
            }

            this.state = 1744;
            localContext._fn = this.tokenStream.LT(1);
            _la = this.tokenStream.LA(1);
            if(!(_la === 154 || _la === 263)) {
                localContext._fn = this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 1745;
            this.match(Sql.LPAREN);
            this.state = 1746;
            localContext._seriesStart = this.expr(0);
            this.state = 1747;
            this.match(Sql.COMMA);
            this.state = 1748;
            localContext._seriesEnd = this.expr(0);
            this.state = 1751;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 10) {
                {
                this.state = 1749;
                this.match(Sql.COMMA);
                this.state = 1750;
                localContext._seriesStep = this.expr(0);
                }
            }

            this.state = 1753;
            this.match(Sql.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowFunctionType(): WindowFunctionTypeContext {
        let localContext = new WindowFunctionTypeContext(this.context, this.state);
        this.enterRule(localContext, 86, Sql.RULE_windowFunctionType);
        let _la: number;
        try {
            this.state = 1802;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.CUME_DIST:
            case Sql.DENSE_RANK:
            case Sql.PERCENT_RANK:
            case Sql.RANK:
                localContext = new RankWindowFunctionContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1755;
                this.rankFunctionType();
                this.state = 1756;
                this.match(Sql.LPAREN);
                this.state = 1757;
                this.match(Sql.RPAREN);
                }
                break;
            case Sql.ROW_NUMBER:
                localContext = new RowNumberWindowFunctionContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1759;
                this.match(Sql.ROW_NUMBER);
                this.state = 1760;
                this.match(Sql.LPAREN);
                this.state = 1761;
                this.match(Sql.RPAREN);
                }
                break;
            case Sql.ARRAY_AGG:
            case Sql.AVG:
            case Sql.BOOL_AND:
            case Sql.BOOL_OR:
            case Sql.COUNT:
            case Sql.EVERY:
            case Sql.MAX:
            case Sql.MIN:
            case Sql.PERCENTILE_CONT:
            case Sql.PERCENTILE_DISC:
            case Sql.STDDEV_POP:
            case Sql.STDDEV_SAMP:
            case Sql.SUM:
            case Sql.VAR_POP:
            case Sql.VAR_SAMP:
                localContext = new AggregateWindowFunctionContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 1762;
                this.aggregateFunction();
                }
                break;
            case Sql.NTILE:
                localContext = new NtileWindowFunctionContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 1763;
                this.match(Sql.NTILE);
                this.state = 1764;
                this.match(Sql.LPAREN);
                this.state = 1765;
                this.numberOfTiles();
                this.state = 1766;
                this.match(Sql.RPAREN);
                }
                break;
            case Sql.LAG:
            case Sql.LEAD:
                localContext = new LeadOrLagWindowFunctionContext(localContext);
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 1768;
                _la = this.tokenStream.LA(1);
                if(!(_la === 181 || _la === 186)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 1769;
                this.match(Sql.LPAREN);
                this.state = 1770;
                (localContext as LeadOrLagWindowFunctionContext)._leadOrLagExtent = this.expr(0);
                this.state = 1777;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 10) {
                    {
                    this.state = 1771;
                    this.match(Sql.COMMA);
                    this.state = 1772;
                    (localContext as LeadOrLagWindowFunctionContext)._offset = this.match(Sql.UNSIGNED_INTEGER);
                    this.state = 1775;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 10) {
                        {
                        this.state = 1773;
                        this.match(Sql.COMMA);
                        this.state = 1774;
                        (localContext as LeadOrLagWindowFunctionContext)._defaultExpression = this.expr(0);
                        }
                    }

                    }
                }

                this.state = 1779;
                this.match(Sql.RPAREN);
                this.state = 1781;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 163 || _la === 277) {
                    {
                    this.state = 1780;
                    this.nullTreatment();
                    }
                }

                }
                break;
            case Sql.FIRST_VALUE:
            case Sql.LAST_VALUE:
                localContext = new FirstOrLastValueWindowFunctionContext(localContext);
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 1783;
                this.firstOrLastValue();
                this.state = 1784;
                this.match(Sql.LPAREN);
                this.state = 1785;
                this.expr(0);
                this.state = 1786;
                this.match(Sql.RPAREN);
                this.state = 1788;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 163 || _la === 277) {
                    {
                    this.state = 1787;
                    this.nullTreatment();
                    }
                }

                }
                break;
            case Sql.NTH_VALUE:
                localContext = new NthValueWindowFunctionContext(localContext);
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 1790;
                this.match(Sql.NTH_VALUE);
                this.state = 1791;
                this.match(Sql.LPAREN);
                this.state = 1792;
                this.expr(0);
                this.state = 1793;
                this.match(Sql.COMMA);
                this.state = 1794;
                this.nthRow();
                this.state = 1795;
                this.match(Sql.RPAREN);
                this.state = 1797;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 152) {
                    {
                    this.state = 1796;
                    this.fromFirstOrLast();
                    }
                }

                this.state = 1800;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 163 || _la === 277) {
                    {
                    this.state = 1799;
                    this.nullTreatment();
                    }
                }

                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public rankFunctionType(): RankFunctionTypeContext {
        let localContext = new RankFunctionTypeContext(this.context, this.state);
        this.enterRule(localContext, 88, Sql.RULE_rankFunctionType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1804;
            _la = this.tokenStream.LA(1);
            if(!(_la === 94 || _la === 115 || _la === 243 || _la === 265)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public numberOfTiles(): NumberOfTilesContext {
        let localContext = new NumberOfTilesContext(this.context, this.state);
        this.enterRule(localContext, 90, Sql.RULE_numberOfTiles);
        try {
            this.state = 1808;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.UNSIGNED_INTEGER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1806;
                this.match(Sql.UNSIGNED_INTEGER);
                }
                break;
            case Sql.POSTGRES_PARAMETER_SPECIFICATION:
            case Sql.QUESTION:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1807;
                this.parameterSpecification();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public nullTreatment(): NullTreatmentContext {
        let localContext = new NullTreatmentContext(this.context, this.state);
        this.enterRule(localContext, 92, Sql.RULE_nullTreatment);
        try {
            this.state = 1814;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.RESPECT:
                localContext = new RespectNullsContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1810;
                this.match(Sql.RESPECT);
                this.state = 1811;
                this.match(Sql.NULLS);
                }
                break;
            case Sql.IGNORE:
                localContext = new IgnoreNullsContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1812;
                this.match(Sql.IGNORE);
                this.state = 1813;
                this.match(Sql.NULLS);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public firstOrLastValue(): FirstOrLastValueContext {
        let localContext = new FirstOrLastValueContext(this.context, this.state);
        this.enterRule(localContext, 94, Sql.RULE_firstOrLastValue);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1816;
            _la = this.tokenStream.LA(1);
            if(!(_la === 143 || _la === 184)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public nthRow(): NthRowContext {
        let localContext = new NthRowContext(this.context, this.state);
        this.enterRule(localContext, 96, Sql.RULE_nthRow);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1818;
            _la = this.tokenStream.LA(1);
            if(!(_la === 5 || _la === 14)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public fromFirstOrLast(): FromFirstOrLastContext {
        let localContext = new FromFirstOrLastContext(this.context, this.state);
        this.enterRule(localContext, 98, Sql.RULE_fromFirstOrLast);
        try {
            this.state = 1824;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 179, this.context) ) {
            case 1:
                localContext = new FromFirstContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1820;
                this.match(Sql.FROM);
                this.state = 1821;
                this.match(Sql.FIRST);
                }
                break;
            case 2:
                localContext = new FromLastContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1822;
                this.match(Sql.FROM);
                this.state = 1823;
                this.match(Sql.LAST);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowNameOrSpecification(): WindowNameOrSpecificationContext {
        let localContext = new WindowNameOrSpecificationContext(this.context, this.state);
        this.enterRule(localContext, 100, Sql.RULE_windowNameOrSpecification);
        try {
            this.state = 1828;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.AT:
            case Sql.ATTACH:
            case Sql.AVG:
            case Sql.BETWEEN:
            case Sql.BIGINT:
            case Sql.BOOL:
            case Sql.BOOLEAN:
            case Sql.BOOL_AND:
            case Sql.BOOL_OR:
            case Sql.BPCHAR:
            case Sql.BY:
            case Sql.BYTEA:
            case Sql.CHAR:
            case Sql.COMMITTED:
            case Sql.COPY:
            case Sql.COUNT:
            case Sql.CUME_DIST:
            case Sql.CURRENT:
            case Sql.DATABASE:
            case Sql.DATE:
            case Sql.DAY:
            case Sql.DEC:
            case Sql.DECIMAL:
            case Sql.DELETE:
            case Sql.DENSE_RANK:
            case Sql.DETACH:
            case Sql.DISCARD:
            case Sql.DOUBLE:
            case Sql.DOW:
            case Sql.DOY:
            case Sql.DURATION:
            case Sql.END:
            case Sql.EPOCH:
            case Sql.ERASE:
            case Sql.EVERY:
            case Sql.FILTER:
            case Sql.FIRST:
            case Sql.FLOAT:
            case Sql.FLOAT4:
            case Sql.FLOAT8:
            case Sql.FORMAT:
            case Sql.HOUR:
            case Sql.INSERT:
            case Sql.INT:
            case Sql.INT2:
            case Sql.INT4:
            case Sql.INT8:
            case Sql.INTEGER:
            case Sql.INTERVAL:
            case Sql.ISODOW:
            case Sql.KEYWORD:
            case Sql.LAST:
            case Sql.LEVEL:
            case Sql.MAX:
            case Sql.METADATA:
            case Sql.MIN:
            case Sql.MINUTE:
            case Sql.MONTH:
            case Sql.NAME:
            case Sql.NEXT:
            case Sql.NUMERIC:
            case Sql.OBJECT:
            case Sql.OF:
            case Sql.OID:
            case Sql.PASSWORD:
            case Sql.PERCENT_RANK:
            case Sql.PERIOD:
            case Sql.PLANS:
            case Sql.POSITION:
            case Sql.PRECISION:
            case Sql.QUARTER:
            case Sql.RANK:
            case Sql.REAL:
            case Sql.RECORD:
            case Sql.REGCLASS:
            case Sql.REGPROC:
            case Sql.ROLE:
            case Sql.ROW:
            case Sql.SECOND:
            case Sql.SELECT:
            case Sql.SEQUENCES:
            case Sql.SETTING:
            case Sql.SMALLINT:
            case Sql.START:
            case Sql.STDDEV_POP:
            case Sql.STDDEV_SAMP:
            case Sql.SUM:
            case Sql.SYNC:
            case Sql.SYSTEM_TIME:
            case Sql.TABLE:
            case Sql.TEMP:
            case Sql.TEMPORARY:
            case Sql.TEXT:
            case Sql.TIME:
            case Sql.TIMESTAMP:
            case Sql.TIMESTAMPTZ:
            case Sql.TIMEZONE:
            case Sql.TSTZRANGE:
            case Sql.UNCOMMITTED:
            case Sql.UPDATE:
            case Sql.URI:
            case Sql.USER:
            case Sql.UUID:
            case Sql.VALID_TIME:
            case Sql.VARCHAR:
            case Sql.VAR_POP:
            case Sql.VAR_SAMP:
            case Sql.VARBINARY:
            case Sql.VERSION:
            case Sql.WEEK:
            case Sql.YEAR:
            case Sql.REGULAR_IDENTIFIER:
            case Sql.DELIMITED_IDENTIFIER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1826;
                localContext._windowName = this.identifier();
                }
                break;
            case Sql.LPAREN:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1827;
                this.windowSpecification();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public nestedWindowFunction(): NestedWindowFunctionContext {
        let localContext = new NestedWindowFunctionContext(this.context, this.state);
        this.enterRule(localContext, 102, Sql.RULE_nestedWindowFunction);
        let _la: number;
        try {
            this.state = 1846;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.ROW_NUMBER:
                localContext = new NestedRowNumberFunctionContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1830;
                this.match(Sql.ROW_NUMBER);
                this.state = 1831;
                this.match(Sql.LPAREN);
                this.state = 1832;
                this.rowMarker();
                this.state = 1833;
                this.match(Sql.RPAREN);
                }
                break;
            case Sql.VALUE_OF:
                localContext = new ValueOfExprAtRowContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1835;
                this.match(Sql.VALUE_OF);
                this.state = 1836;
                this.match(Sql.LPAREN);
                this.state = 1837;
                this.expr(0);
                this.state = 1838;
                this.match(Sql.AT);
                this.state = 1839;
                this.rowMarkerExpression();
                this.state = 1842;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 10) {
                    {
                    this.state = 1840;
                    this.match(Sql.COMMA);
                    this.state = 1841;
                    this.valueOfDefaultValue();
                    }
                }

                this.state = 1844;
                this.match(Sql.RPAREN);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public rowMarker(): RowMarkerContext {
        let localContext = new RowMarkerContext(this.context, this.state);
        this.enterRule(localContext, 104, Sql.RULE_rowMarker);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1848;
            _la = this.tokenStream.LA(1);
            if(!(_la === 65 || _la === 66 || ((((_la - 98)) & ~0x1F) === 0 && ((1 << (_la - 98)) & 805306369) !== 0) || _la === 151)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public rowMarkerExpression(): RowMarkerExpressionContext {
        let localContext = new RowMarkerExpressionContext(this.context, this.state);
        this.enterRule(localContext, 106, Sql.RULE_rowMarkerExpression);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1850;
            this.rowMarker();
            this.state = 1852;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 24 || _la === 27) {
                {
                this.state = 1851;
                this.rowMarkerDelta();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public rowMarkerDelta(): RowMarkerDeltaContext {
        let localContext = new RowMarkerDeltaContext(this.context, this.state);
        this.enterRule(localContext, 108, Sql.RULE_rowMarkerDelta);
        try {
            this.state = 1858;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.PLUS:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1854;
                this.match(Sql.PLUS);
                this.state = 1855;
                this.rowMarkerOffset();
                }
                break;
            case Sql.MINUS:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1856;
                this.match(Sql.MINUS);
                this.state = 1857;
                this.rowMarkerOffset();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public rowMarkerOffset(): RowMarkerOffsetContext {
        let localContext = new RowMarkerOffsetContext(this.context, this.state);
        this.enterRule(localContext, 110, Sql.RULE_rowMarkerOffset);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1860;
            _la = this.tokenStream.LA(1);
            if(!(_la === 5 || _la === 14)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public valueOfDefaultValue(): ValueOfDefaultValueContext {
        let localContext = new ValueOfDefaultValueContext(this.context, this.state);
        this.enterRule(localContext, 112, Sql.RULE_valueOfDefaultValue);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1862;
            this.expr(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public simpleWhenClause(): SimpleWhenClauseContext {
        let localContext = new SimpleWhenClauseContext(this.context, this.state);
        this.enterRule(localContext, 114, Sql.RULE_simpleWhenClause);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1864;
            this.match(Sql.WHEN);
            this.state = 1865;
            this.whenOperandList();
            this.state = 1866;
            this.match(Sql.THEN);
            this.state = 1867;
            this.expr(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public searchedWhenClause(): SearchedWhenClauseContext {
        let localContext = new SearchedWhenClauseContext(this.context, this.state);
        this.enterRule(localContext, 116, Sql.RULE_searchedWhenClause);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1869;
            this.match(Sql.WHEN);
            this.state = 1870;
            this.expr(0);
            this.state = 1871;
            this.match(Sql.THEN);
            this.state = 1872;
            this.expr(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public elseClause(): ElseClauseContext {
        let localContext = new ElseClauseContext(this.context, this.state);
        this.enterRule(localContext, 118, Sql.RULE_elseClause);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1874;
            this.match(Sql.ELSE);
            this.state = 1875;
            this.expr(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public whenOperandList(): WhenOperandListContext {
        let localContext = new WhenOperandListContext(this.context, this.state);
        this.enterRule(localContext, 120, Sql.RULE_whenOperandList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1877;
            this.whenOperand();
            this.state = 1882;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 10) {
                {
                {
                this.state = 1878;
                this.match(Sql.COMMA);
                this.state = 1879;
                this.whenOperand();
                }
                }
                this.state = 1884;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public whenOperand(): WhenOperandContext {
        let localContext = new WhenOperandContext(this.context, this.state);
        this.enterRule(localContext, 122, Sql.RULE_whenOperand);
        try {
            this.state = 1887;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 186, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1885;
                this.predicatePart2();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1886;
                this.expr(0);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public extractField(): ExtractFieldContext {
        let localContext = new ExtractFieldContext(this.context, this.state);
        this.enterRule(localContext, 124, Sql.RULE_extractField);
        try {
            this.state = 1892;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.DAY:
            case Sql.HOUR:
            case Sql.MINUTE:
            case Sql.MONTH:
            case Sql.SECOND:
            case Sql.YEAR:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1889;
                this.primaryDatetimeField();
                }
                break;
            case Sql.TIMEZONE_HOUR:
            case Sql.TIMEZONE_MINUTE:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1890;
                this.timeZoneField();
                }
                break;
            case Sql.DOW:
            case Sql.DOY:
            case Sql.EPOCH:
            case Sql.ISODOW:
            case Sql.QUARTER:
            case Sql.WEEK:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 1891;
                this.pgExtractField();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public primaryDatetimeField(): PrimaryDatetimeFieldContext {
        let localContext = new PrimaryDatetimeFieldContext(this.context, this.state);
        this.enterRule(localContext, 126, Sql.RULE_primaryDatetimeField);
        try {
            this.state = 1896;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.DAY:
            case Sql.HOUR:
            case Sql.MINUTE:
            case Sql.MONTH:
            case Sql.YEAR:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1894;
                this.nonSecondPrimaryDatetimeField();
                }
                break;
            case Sql.SECOND:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1895;
                this.match(Sql.SECOND);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public timeZoneField(): TimeZoneFieldContext {
        let localContext = new TimeZoneFieldContext(this.context, this.state);
        this.enterRule(localContext, 128, Sql.RULE_timeZoneField);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1898;
            _la = this.tokenStream.LA(1);
            if(!(_la === 319 || _la === 320)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public pgExtractField(): PgExtractFieldContext {
        let localContext = new PgExtractFieldContext(this.context, this.state);
        this.enterRule(localContext, 130, Sql.RULE_pgExtractField);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1900;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 121)) & ~0x1F) === 0 && ((1 << (_la - 121)) & 131) !== 0) || _la === 178 || _la === 262 || _la === 353)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public trimSpecification(): TrimSpecificationContext {
        let localContext = new TrimSpecificationContext(this.context, this.state);
        this.enterRule(localContext, 132, Sql.RULE_trimSpecification);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1902;
            _la = this.tokenStream.LA(1);
            if(!(_la === 73 || _la === 188 || _la === 322)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public dateTruncPrecision(): DateTruncPrecisionContext {
        let localContext = new DateTruncPrecisionContext(this.context, this.state);
        this.enterRule(localContext, 134, Sql.RULE_dateTruncPrecision);
        try {
            this.state = 1919;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.MILLENNIUM:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1904;
                this.match(Sql.MILLENNIUM);
                }
                break;
            case Sql.CENTURY:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1905;
                this.match(Sql.CENTURY);
                }
                break;
            case Sql.DECADE:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 1906;
                this.match(Sql.DECADE);
                }
                break;
            case Sql.YEAR:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 1907;
                this.match(Sql.YEAR);
                }
                break;
            case Sql.QUARTER:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 1908;
                this.match(Sql.QUARTER);
                }
                break;
            case Sql.MONTH:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 1909;
                this.match(Sql.MONTH);
                }
                break;
            case Sql.WEEK:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 1910;
                this.match(Sql.WEEK);
                }
                break;
            case Sql.DAY:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 1911;
                this.match(Sql.DAY);
                }
                break;
            case Sql.HOUR:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 1912;
                this.match(Sql.HOUR);
                }
                break;
            case Sql.MINUTE:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 1913;
                this.match(Sql.MINUTE);
                }
                break;
            case Sql.SECOND:
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 1914;
                this.match(Sql.SECOND);
                }
                break;
            case Sql.MILLISECOND:
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 1915;
                this.match(Sql.MILLISECOND);
                }
                break;
            case Sql.MICROSECOND:
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 1916;
                this.match(Sql.MICROSECOND);
                }
                break;
            case Sql.NANOSECOND:
                this.enterOuterAlt(localContext, 14);
                {
                this.state = 1917;
                this.match(Sql.NANOSECOND);
                }
                break;
            case Sql.CHARACTER_STRING:
            case Sql.C_ESCAPES_STRING:
            case Sql.DOLLAR_TAG:
                this.enterOuterAlt(localContext, 15);
                {
                this.state = 1918;
                this.characterString();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public arrayValueConstructor(): ArrayValueConstructorContext {
        let localContext = new ArrayValueConstructorContext(this.context, this.state);
        this.enterRule(localContext, 136, Sql.RULE_arrayValueConstructor);
        let _la: number;
        try {
            this.state = 1938;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 193, this.context) ) {
            case 1:
                localContext = new ArrayValueConstructorByEnumerationContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1922;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 53) {
                    {
                    this.state = 1921;
                    this.match(Sql.ARRAY);
                    }
                }

                this.state = 1924;
                this.match(Sql.LBRACK);
                this.state = 1933;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 155894768) !== 0) || ((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & 3421488003) !== 0) || ((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & 3053449013) !== 0) || ((((_la - 118)) & ~0x1F) === 0 && ((1 << (_la - 118)) & 1001673917) !== 0) || ((((_la - 150)) & ~0x1F) === 0 && ((1 << (_la - 150)) & 3514701585) !== 0) || ((((_la - 183)) & ~0x1F) === 0 && ((1 << (_la - 183)) & 1942413451) !== 0) || ((((_la - 216)) & ~0x1F) === 0 && ((1 << (_la - 216)) & 4206915007) !== 0) || ((((_la - 248)) & ~0x1F) === 0 && ((1 << (_la - 248)) & 328981679) !== 0) || ((((_la - 281)) & ~0x1F) === 0 && ((1 << (_la - 281)) & 4249790709) !== 0) || ((((_la - 315)) & ~0x1F) === 0 && ((1 << (_la - 315)) & 1878810127) !== 0) || ((((_la - 347)) & ~0x1F) === 0 && ((1 << (_la - 347)) & 950399) !== 0)) {
                    {
                    this.state = 1925;
                    this.expr(0);
                    this.state = 1930;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 10) {
                        {
                        {
                        this.state = 1926;
                        this.match(Sql.COMMA);
                        this.state = 1927;
                        this.expr(0);
                        }
                        }
                        this.state = 1932;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    }
                }

                this.state = 1935;
                this.match(Sql.RBRACK);
                }
                break;
            case 2:
                localContext = new ArrayValueConstructorByQueryContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1936;
                this.match(Sql.ARRAY);
                this.state = 1937;
                this.subquery();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public rowValueConstructor(): RowValueConstructorContext {
        let localContext = new RowValueConstructorContext(this.context, this.state);
        this.enterRule(localContext, 138, Sql.RULE_rowValueConstructor);
        let _la: number;
        try {
            this.state = 1965;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 198, this.context) ) {
            case 1:
                localContext = new MultiExprRowConstructorContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1940;
                this.match(Sql.ROW);
                this.state = 1941;
                this.match(Sql.LPAREN);
                this.state = 1950;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 155894768) !== 0) || ((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & 3421488003) !== 0) || ((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & 3053449013) !== 0) || ((((_la - 118)) & ~0x1F) === 0 && ((1 << (_la - 118)) & 1001673917) !== 0) || ((((_la - 150)) & ~0x1F) === 0 && ((1 << (_la - 150)) & 3514701585) !== 0) || ((((_la - 183)) & ~0x1F) === 0 && ((1 << (_la - 183)) & 1942413451) !== 0) || ((((_la - 216)) & ~0x1F) === 0 && ((1 << (_la - 216)) & 4206915007) !== 0) || ((((_la - 248)) & ~0x1F) === 0 && ((1 << (_la - 248)) & 328981679) !== 0) || ((((_la - 281)) & ~0x1F) === 0 && ((1 << (_la - 281)) & 4249790709) !== 0) || ((((_la - 315)) & ~0x1F) === 0 && ((1 << (_la - 315)) & 1878810127) !== 0) || ((((_la - 347)) & ~0x1F) === 0 && ((1 << (_la - 347)) & 950399) !== 0)) {
                    {
                    this.state = 1942;
                    this.expr(0);
                    this.state = 1947;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 10) {
                        {
                        {
                        this.state = 1943;
                        this.match(Sql.COMMA);
                        this.state = 1944;
                        this.expr(0);
                        }
                        }
                        this.state = 1949;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    }
                }

                this.state = 1952;
                this.match(Sql.RPAREN);
                }
                break;
            case 2:
                localContext = new SingleExprRowConstructorContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1953;
                this.expr(0);
                }
                break;
            case 3:
                localContext = new MultiExprRowConstructorContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 1954;
                this.match(Sql.LPAREN);
                this.state = 1962;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 155894768) !== 0) || ((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & 3421488003) !== 0) || ((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & 3053449013) !== 0) || ((((_la - 118)) & ~0x1F) === 0 && ((1 << (_la - 118)) & 1001673917) !== 0) || ((((_la - 150)) & ~0x1F) === 0 && ((1 << (_la - 150)) & 3514701585) !== 0) || ((((_la - 183)) & ~0x1F) === 0 && ((1 << (_la - 183)) & 1942413451) !== 0) || ((((_la - 216)) & ~0x1F) === 0 && ((1 << (_la - 216)) & 4206915007) !== 0) || ((((_la - 248)) & ~0x1F) === 0 && ((1 << (_la - 248)) & 328981679) !== 0) || ((((_la - 281)) & ~0x1F) === 0 && ((1 << (_la - 281)) & 4249790709) !== 0) || ((((_la - 315)) & ~0x1F) === 0 && ((1 << (_la - 315)) & 1878810127) !== 0) || ((((_la - 347)) & ~0x1F) === 0 && ((1 << (_la - 347)) & 950399) !== 0)) {
                    {
                    this.state = 1955;
                    this.expr(0);
                    this.state = 1958;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    do {
                        {
                        {
                        this.state = 1956;
                        this.match(Sql.COMMA);
                        this.state = 1957;
                        this.expr(0);
                        }
                        }
                        this.state = 1960;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    } while (_la === 10);
                    }
                }

                this.state = 1964;
                this.match(Sql.RPAREN);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public rowValueList(): RowValueListContext {
        let localContext = new RowValueListContext(this.context, this.state);
        this.enterRule(localContext, 140, Sql.RULE_rowValueList);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1967;
            this.rowValueConstructor();
            this.state = 1972;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 199, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 1968;
                    this.match(Sql.COMMA);
                    this.state = 1969;
                    this.rowValueConstructor();
                    }
                    }
                }
                this.state = 1974;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 199, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public tableValueConstructor(): TableValueConstructorContext {
        let localContext = new TableValueConstructorContext(this.context, this.state);
        this.enterRule(localContext, 142, Sql.RULE_tableValueConstructor);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1975;
            this.match(Sql.VALUES);
            this.state = 1976;
            this.rowValueList();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public recordValueConstructor(): RecordValueConstructorContext {
        let localContext = new RecordValueConstructorContext(this.context, this.state);
        this.enterRule(localContext, 144, Sql.RULE_recordValueConstructor);
        try {
            this.state = 1980;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.POSTGRES_PARAMETER_SPECIFICATION:
            case Sql.QUESTION:
                localContext = new ParameterRecordContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 1978;
                this.parameterSpecification();
                }
                break;
            case Sql.LBRACE:
            case Sql.OBJECT:
            case Sql.RECORD:
                localContext = new ObjectRecordContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 1979;
                this.objectConstructor();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public recordsValueList(): RecordsValueListContext {
        let localContext = new RecordsValueListContext(this.context, this.state);
        this.enterRule(localContext, 146, Sql.RULE_recordsValueList);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1982;
            this.recordValueConstructor();
            this.state = 1987;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 201, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 1983;
                    this.match(Sql.COMMA);
                    this.state = 1984;
                    this.recordValueConstructor();
                    }
                    }
                }
                this.state = 1989;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 201, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public recordsValueConstructor(): RecordsValueConstructorContext {
        let localContext = new RecordsValueConstructorContext(this.context, this.state);
        this.enterRule(localContext, 148, Sql.RULE_recordsValueConstructor);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1990;
            this.match(Sql.RECORDS);
            this.state = 1991;
            this.recordsValueList();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public fromClause(): FromClauseContext {
        let localContext = new FromClauseContext(this.context, this.state);
        this.enterRule(localContext, 150, Sql.RULE_fromClause);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 1993;
            this.match(Sql.FROM);
            this.state = 1994;
            this.tableReference(0);
            this.state = 1999;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 202, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 1995;
                    this.match(Sql.COMMA);
                    this.state = 1996;
                    this.tableReference(0);
                    }
                    }
                }
                this.state = 2001;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 202, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public tableReference(): TableReferenceContext;
    public tableReference(_p: number): TableReferenceContext;
    public tableReference(_p?: number): TableReferenceContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new TableReferenceContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 152;
        this.enterRecursionRule(localContext, 152, Sql.RULE_tableReference, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2061;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 216, this.context) ) {
            case 1:
                {
                localContext = new BaseTableContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 2003;
                this.fromTableRef();
                this.state = 2008;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 204, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        this.state = 2006;
                        this.errorHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this.tokenStream, 203, this.context) ) {
                        case 1:
                            {
                            this.state = 2004;
                            this.querySystemTimePeriodSpecification();
                            }
                            break;
                        case 2:
                            {
                            this.state = 2005;
                            this.queryValidTimePeriodSpecification();
                            }
                            break;
                        }
                        }
                    }
                    this.state = 2010;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 204, this.context);
                }
                this.state = 2015;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 206, this.context) ) {
                case 1:
                    {
                    this.state = 2011;
                    this.tableAlias();
                    this.state = 2013;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 205, this.context) ) {
                    case 1:
                        {
                        this.state = 2012;
                        this.tableProjection();
                        }
                        break;
                    }
                    }
                    break;
                }
                }
                break;
            case 2:
                {
                localContext = new DerivedTableContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 2017;
                this.subquery();
                this.state = 2018;
                this.tableAlias();
                this.state = 2020;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 207, this.context) ) {
                case 1:
                    {
                    this.state = 2019;
                    this.tableProjection();
                    }
                    break;
                }
                }
                break;
            case 3:
                {
                localContext = new LateralDerivedTableContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 2022;
                this.match(Sql.LATERAL);
                this.state = 2023;
                this.subquery();
                this.state = 2024;
                this.tableAlias();
                this.state = 2026;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 208, this.context) ) {
                case 1:
                    {
                    this.state = 2025;
                    this.tableProjection();
                    }
                    break;
                }
                }
                break;
            case 4:
                {
                localContext = new CollectionDerivedTableContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 2028;
                this.match(Sql.UNNEST);
                this.state = 2029;
                this.match(Sql.LPAREN);
                this.state = 2030;
                this.expr(0);
                this.state = 2031;
                this.match(Sql.RPAREN);
                this.state = 2033;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 358) {
                    {
                    this.state = 2032;
                    this.withOrdinality();
                    }
                }

                this.state = 2035;
                this.tableAlias();
                this.state = 2037;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 210, this.context) ) {
                case 1:
                    {
                    this.state = 2036;
                    this.tableProjection();
                    }
                    break;
                }
                }
                break;
            case 5:
                {
                localContext = new GenerateSeriesTableContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 2039;
                this.generateSeries();
                this.state = 2041;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 358) {
                    {
                    this.state = 2040;
                    this.withOrdinality();
                    }
                }

                this.state = 2043;
                this.tableAlias();
                this.state = 2045;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 212, this.context) ) {
                case 1:
                    {
                    this.state = 2044;
                    this.tableProjection();
                    }
                    break;
                }
                }
                break;
            case 6:
                {
                localContext = new ExprDerivedTableContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 2047;
                this.expr(0);
                this.state = 2049;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 213, this.context) ) {
                case 1:
                    {
                    this.state = 2048;
                    this.withOrdinality();
                    }
                    break;
                }
                this.state = 2055;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 215, this.context) ) {
                case 1:
                    {
                    this.state = 2051;
                    this.tableAlias();
                    this.state = 2053;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 214, this.context) ) {
                    case 1:
                        {
                        this.state = 2052;
                        this.tableProjection();
                        }
                        break;
                    }
                    }
                    break;
                }
                }
                break;
            case 7:
                {
                localContext = new WrappedTableReferenceContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 2057;
                this.match(Sql.LPAREN);
                this.state = 2058;
                this.tableReference(0);
                this.state = 2059;
                this.match(Sql.RPAREN);
                }
                break;
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 2084;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 220, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 2082;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 219, this.context) ) {
                    case 1:
                        {
                        localContext = new CrossJoinTableContext(new TableReferenceContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_tableReference);
                        this.state = 2063;
                        if (!(this.precpred(this.context, 8))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 8)");
                        }
                        this.state = 2064;
                        this.match(Sql.CROSS);
                        this.state = 2065;
                        this.match(Sql.JOIN);
                        this.state = 2066;
                        this.tableReference(9);
                        }
                        break;
                    case 2:
                        {
                        localContext = new NaturalJoinTableContext(new TableReferenceContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_tableReference);
                        this.state = 2067;
                        if (!(this.precpred(this.context, 7))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 7)");
                        }
                        this.state = 2068;
                        this.match(Sql.NATURAL);
                        this.state = 2070;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        if (_la === 153 || _la === 166 || _la === 189 || _la === 280) {
                            {
                            this.state = 2069;
                            this.joinType();
                            }
                        }

                        this.state = 2072;
                        this.match(Sql.JOIN);
                        this.state = 2073;
                        this.tableReference(8);
                        }
                        break;
                    case 3:
                        {
                        localContext = new JoinTableContext(new TableReferenceContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_tableReference);
                        this.state = 2074;
                        if (!(this.precpred(this.context, 9))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 9)");
                        }
                        this.state = 2076;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        if (_la === 153 || _la === 166 || _la === 189 || _la === 280) {
                            {
                            this.state = 2075;
                            this.joinType();
                            }
                        }

                        this.state = 2078;
                        this.match(Sql.JOIN);
                        this.state = 2079;
                        this.tableReference(0);
                        this.state = 2080;
                        this.joinSpecification();
                        }
                        break;
                    }
                    }
                }
                this.state = 2086;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 220, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public withOrdinality(): WithOrdinalityContext {
        let localContext = new WithOrdinalityContext(this.context, this.state);
        this.enterRule(localContext, 154, Sql.RULE_withOrdinality);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2087;
            this.match(Sql.WITH);
            this.state = 2088;
            this.match(Sql.ORDINALITY);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public tableAlias(): TableAliasContext {
        let localContext = new TableAliasContext(this.context, this.state);
        this.enterRule(localContext, 156, Sql.RULE_tableAlias);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2091;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 2090;
                this.match(Sql.AS);
                }
            }

            this.state = 2093;
            localContext._correlationName = this.identifier();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public tableProjection(): TableProjectionContext {
        let localContext = new TableProjectionContext(this.context, this.state);
        this.enterRule(localContext, 158, Sql.RULE_tableProjection);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2095;
            this.match(Sql.LPAREN);
            this.state = 2096;
            this.columnNameList();
            this.state = 2097;
            this.match(Sql.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public querySystemTimePeriodSpecification(): QuerySystemTimePeriodSpecificationContext {
        let localContext = new QuerySystemTimePeriodSpecificationContext(this.context, this.state);
        this.enterRule(localContext, 160, Sql.RULE_querySystemTimePeriodSpecification);
        try {
            this.state = 2105;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 222, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2099;
                this.match(Sql.FOR);
                this.state = 2100;
                this.match(Sql.SYSTEM_TIME);
                this.state = 2101;
                this.tableTimePeriodSpecification();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2102;
                this.match(Sql.FOR);
                this.state = 2103;
                this.match(Sql.ALL);
                this.state = 2104;
                this.match(Sql.SYSTEM_TIME);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public queryValidTimePeriodSpecification(): QueryValidTimePeriodSpecificationContext {
        let localContext = new QueryValidTimePeriodSpecificationContext(this.context, this.state);
        this.enterRule(localContext, 162, Sql.RULE_queryValidTimePeriodSpecification);
        try {
            this.state = 2121;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 223, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2107;
                this.match(Sql.FOR);
                this.state = 2108;
                this.match(Sql.VALID_TIME);
                this.state = 2109;
                this.tableTimePeriodSpecification();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2110;
                this.match(Sql.FOR);
                this.state = 2111;
                this.match(Sql.VALID_TIME);
                this.state = 2112;
                this.match(Sql.ONLY);
                this.state = 2113;
                this.match(Sql.FROM);
                this.state = 2114;
                localContext._from_ = this.expr(0);
                this.state = 2115;
                this.match(Sql.TO);
                this.state = 2116;
                localContext._to = this.expr(0);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 2118;
                this.match(Sql.FOR);
                this.state = 2119;
                this.match(Sql.ALL);
                this.state = 2120;
                this.match(Sql.VALID_TIME);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public tableTimePeriodSpecification(): TableTimePeriodSpecificationContext {
        let localContext = new TableTimePeriodSpecificationContext(this.context, this.state);
        this.enterRule(localContext, 164, Sql.RULE_tableTimePeriodSpecification);
        try {
            this.state = 2137;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.AS:
                localContext = new TableAsOfContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2123;
                this.match(Sql.AS);
                this.state = 2124;
                this.match(Sql.OF);
                this.state = 2125;
                (localContext as TableAsOfContext)._at = this.expr(0);
                }
                break;
            case Sql.ALL:
                localContext = new TableAllTimeContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2126;
                this.match(Sql.ALL);
                }
                break;
            case Sql.BETWEEN:
                localContext = new TableBetweenContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 2127;
                this.match(Sql.BETWEEN);
                this.state = 2128;
                (localContext as TableBetweenContext)._from_ = this.expr(0);
                this.state = 2129;
                this.match(Sql.AND);
                this.state = 2130;
                (localContext as TableBetweenContext)._to = this.expr(0);
                }
                break;
            case Sql.FROM:
                localContext = new TableFromToContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 2132;
                this.match(Sql.FROM);
                this.state = 2133;
                (localContext as TableFromToContext)._from_ = this.expr(0);
                this.state = 2134;
                this.match(Sql.TO);
                this.state = 2135;
                (localContext as TableFromToContext)._to = this.expr(0);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public fromTableRef(): FromTableRefContext {
        let localContext = new FromTableRefContext(this.context, this.state);
        this.enterRule(localContext, 166, Sql.RULE_fromTableRef);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2147;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 226, this.context) ) {
            case 1:
                {
                this.state = 2142;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 225, this.context) ) {
                case 1:
                    {
                    this.state = 2139;
                    this.identifier();
                    this.state = 2140;
                    this.match(Sql.DOT);
                    }
                    break;
                }
                this.state = 2144;
                this.identifier();
                this.state = 2145;
                this.match(Sql.DOT);
                }
                break;
            }
            this.state = 2149;
            this.identifier();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public columnNameList(): ColumnNameListContext {
        let localContext = new ColumnNameListContext(this.context, this.state);
        this.enterRule(localContext, 168, Sql.RULE_columnNameList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2151;
            this.columnName();
            this.state = 2156;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 10) {
                {
                {
                this.state = 2152;
                this.match(Sql.COMMA);
                this.state = 2153;
                this.columnName();
                }
                }
                this.state = 2158;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public joinSpecification(): JoinSpecificationContext {
        let localContext = new JoinSpecificationContext(this.context, this.state);
        this.enterRule(localContext, 170, Sql.RULE_joinSpecification);
        try {
            this.state = 2166;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.ON:
                localContext = new JoinConditionContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2159;
                this.match(Sql.ON);
                this.state = 2160;
                this.expr(0);
                }
                break;
            case Sql.USING:
                localContext = new NamedColumnsJoinContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2161;
                this.match(Sql.USING);
                this.state = 2162;
                this.match(Sql.LPAREN);
                this.state = 2163;
                this.columnNameList();
                this.state = 2164;
                this.match(Sql.RPAREN);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public joinType(): JoinTypeContext {
        let localContext = new JoinTypeContext(this.context, this.state);
        this.enterRule(localContext, 172, Sql.RULE_joinType);
        let _la: number;
        try {
            this.state = 2173;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.INNER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2168;
                this.match(Sql.INNER);
                }
                break;
            case Sql.FULL:
            case Sql.LEFT:
            case Sql.RIGHT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2169;
                this.outerJoinType();
                this.state = 2171;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 236) {
                    {
                    this.state = 2170;
                    this.match(Sql.OUTER);
                    }
                }

                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public outerJoinType(): OuterJoinTypeContext {
        let localContext = new OuterJoinTypeContext(this.context, this.state);
        this.enterRule(localContext, 174, Sql.RULE_outerJoinType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2175;
            _la = this.tokenStream.LA(1);
            if(!(_la === 153 || _la === 189 || _la === 280)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public whereClause(): WhereClauseContext {
        let localContext = new WhereClauseContext(this.context, this.state);
        this.enterRule(localContext, 176, Sql.RULE_whereClause);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2177;
            this.match(Sql.WHERE);
            this.state = 2178;
            this.searchCondition();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public groupByClause(): GroupByClauseContext {
        let localContext = new GroupByClauseContext(this.context, this.state);
        this.enterRule(localContext, 178, Sql.RULE_groupByClause);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2180;
            this.match(Sql.GROUP);
            this.state = 2181;
            this.match(Sql.BY);
            this.state = 2183;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 48 || _la === 119) {
                {
                this.state = 2182;
                this.setQuantifier();
                }
            }

            this.state = 2185;
            this.groupingElement();
            this.state = 2190;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 232, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 2186;
                    this.match(Sql.COMMA);
                    this.state = 2187;
                    this.groupingElement();
                    }
                    }
                }
                this.state = 2192;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 232, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public groupingElement(): GroupingElementContext {
        let localContext = new GroupingElementContext(this.context, this.state);
        this.enterRule(localContext, 180, Sql.RULE_groupingElement);
        try {
            this.state = 2196;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 233, this.context) ) {
            case 1:
                localContext = new ExpressionGroupingSetContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2193;
                this.expr(0);
                }
                break;
            case 2:
                localContext = new EmptyGroupingSetContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2194;
                this.match(Sql.LPAREN);
                this.state = 2195;
                this.match(Sql.RPAREN);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public havingClause(): HavingClauseContext {
        let localContext = new HavingClauseContext(this.context, this.state);
        this.enterRule(localContext, 182, Sql.RULE_havingClause);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2198;
            this.match(Sql.HAVING);
            this.state = 2199;
            this.searchCondition();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowClause(): WindowClauseContext {
        let localContext = new WindowClauseContext(this.context, this.state);
        this.enterRule(localContext, 184, Sql.RULE_windowClause);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2201;
            this.match(Sql.WINDOW);
            this.state = 2202;
            this.windowDefinitionList();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowDefinitionList(): WindowDefinitionListContext {
        let localContext = new WindowDefinitionListContext(this.context, this.state);
        this.enterRule(localContext, 186, Sql.RULE_windowDefinitionList);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2204;
            this.windowDefinition();
            this.state = 2209;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 234, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 2205;
                    this.match(Sql.COMMA);
                    this.state = 2206;
                    this.windowDefinition();
                    }
                    }
                }
                this.state = 2211;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 234, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowDefinition(): WindowDefinitionContext {
        let localContext = new WindowDefinitionContext(this.context, this.state);
        this.enterRule(localContext, 188, Sql.RULE_windowDefinition);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2212;
            this.newWindowName();
            this.state = 2213;
            this.match(Sql.AS);
            this.state = 2214;
            this.windowSpecification();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public newWindowName(): NewWindowNameContext {
        let localContext = new NewWindowNameContext(this.context, this.state);
        this.enterRule(localContext, 190, Sql.RULE_newWindowName);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2216;
            localContext._windowName = this.identifier();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowSpecification(): WindowSpecificationContext {
        let localContext = new WindowSpecificationContext(this.context, this.state);
        this.enterRule(localContext, 192, Sql.RULE_windowSpecification);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2218;
            this.match(Sql.LPAREN);
            this.state = 2219;
            this.windowSpecificationDetails();
            this.state = 2220;
            this.match(Sql.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowSpecificationDetails(): WindowSpecificationDetailsContext {
        let localContext = new WindowSpecificationDetailsContext(this.context, this.state);
        this.enterRule(localContext, 194, Sql.RULE_windowSpecificationDetails);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2223;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 60)) & ~0x1F) === 0 && ((1 << (_la - 60)) & 3490832263) !== 0) || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 3182794755) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 5136405) !== 0) || ((((_la - 162)) & ~0x1F) === 0 && ((1 << (_la - 162)) & 270866401) !== 0) || ((((_la - 200)) & ~0x1F) === 0 && ((1 << (_la - 200)) & 629154275) !== 0) || ((((_la - 241)) & ~0x1F) === 0 && ((1 << (_la - 241)) & 1294487565) !== 0) || ((((_la - 273)) & ~0x1F) === 0 && ((1 << (_la - 273)) & 237561089) !== 0) || ((((_la - 305)) & ~0x1F) === 0 && ((1 << (_la - 305)) & 826293501) !== 0) || ((((_la - 342)) & ~0x1F) === 0 && ((1 << (_la - 342)) & 26218445) !== 0)) {
                {
                this.state = 2222;
                localContext._existingWindowName = this.identifier();
                }
            }

            this.state = 2226;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 240) {
                {
                this.state = 2225;
                this.windowPartitionClause();
                }
            }

            this.state = 2229;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 233) {
                {
                this.state = 2228;
                this.windowOrderClause();
                }
            }

            this.state = 2232;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 157 || _la === 263 || _la === 284) {
                {
                this.state = 2231;
                this.windowFrameClause();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowPartitionClause(): WindowPartitionClauseContext {
        let localContext = new WindowPartitionClauseContext(this.context, this.state);
        this.enterRule(localContext, 196, Sql.RULE_windowPartitionClause);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2234;
            this.match(Sql.PARTITION);
            this.state = 2235;
            this.match(Sql.BY);
            this.state = 2236;
            this.windowPartitionColumnReferenceList();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowPartitionColumnReferenceList(): WindowPartitionColumnReferenceListContext {
        let localContext = new WindowPartitionColumnReferenceListContext(this.context, this.state);
        this.enterRule(localContext, 198, Sql.RULE_windowPartitionColumnReferenceList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2238;
            this.columnReference();
            this.state = 2243;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 10) {
                {
                {
                this.state = 2239;
                this.match(Sql.COMMA);
                this.state = 2240;
                this.columnReference();
                }
                }
                this.state = 2245;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowOrderClause(): WindowOrderClauseContext {
        let localContext = new WindowOrderClauseContext(this.context, this.state);
        this.enterRule(localContext, 200, Sql.RULE_windowOrderClause);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2246;
            this.match(Sql.ORDER);
            this.state = 2247;
            this.match(Sql.BY);
            this.state = 2248;
            this.sortSpecificationList();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowFrameClause(): WindowFrameClauseContext {
        let localContext = new WindowFrameClauseContext(this.context, this.state);
        this.enterRule(localContext, 202, Sql.RULE_windowFrameClause);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2250;
            this.windowFrameUnits();
            this.state = 2251;
            this.windowFrameExtent();
            this.state = 2253;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 134) {
                {
                this.state = 2252;
                this.windowFrameExclusion();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowFrameUnits(): WindowFrameUnitsContext {
        let localContext = new WindowFrameUnitsContext(this.context, this.state);
        this.enterRule(localContext, 204, Sql.RULE_windowFrameUnits);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2255;
            _la = this.tokenStream.LA(1);
            if(!(_la === 157 || _la === 263 || _la === 284)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowFrameExtent(): WindowFrameExtentContext {
        let localContext = new WindowFrameExtentContext(this.context, this.state);
        this.enterRule(localContext, 206, Sql.RULE_windowFrameExtent);
        try {
            this.state = 2259;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.UNSIGNED_INTEGER:
            case Sql.CURRENT:
            case Sql.UNBOUNDED:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2257;
                this.windowFrameStart();
                }
                break;
            case Sql.BETWEEN:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2258;
                this.windowFrameBetween();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowFrameStart(): WindowFrameStartContext {
        let localContext = new WindowFrameStartContext(this.context, this.state);
        this.enterRule(localContext, 208, Sql.RULE_windowFrameStart);
        try {
            this.state = 2266;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.UNBOUNDED:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2261;
                this.match(Sql.UNBOUNDED);
                this.state = 2262;
                this.match(Sql.PRECEDING);
                }
                break;
            case Sql.UNSIGNED_INTEGER:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2263;
                this.windowFramePreceding();
                }
                break;
            case Sql.CURRENT:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 2264;
                this.match(Sql.CURRENT);
                this.state = 2265;
                this.match(Sql.ROW);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowFramePreceding(): WindowFramePrecedingContext {
        let localContext = new WindowFramePrecedingContext(this.context, this.state);
        this.enterRule(localContext, 210, Sql.RULE_windowFramePreceding);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2268;
            this.match(Sql.UNSIGNED_INTEGER);
            this.state = 2269;
            this.match(Sql.PRECEDING);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowFrameBetween(): WindowFrameBetweenContext {
        let localContext = new WindowFrameBetweenContext(this.context, this.state);
        this.enterRule(localContext, 212, Sql.RULE_windowFrameBetween);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2271;
            this.match(Sql.BETWEEN);
            this.state = 2272;
            localContext._windowFrameBound1 = this.windowFrameBound();
            this.state = 2273;
            this.match(Sql.AND);
            this.state = 2274;
            localContext._windowFrameBound2 = this.windowFrameBound();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowFrameBound(): WindowFrameBoundContext {
        let localContext = new WindowFrameBoundContext(this.context, this.state);
        this.enterRule(localContext, 214, Sql.RULE_windowFrameBound);
        try {
            this.state = 2280;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 243, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2276;
                this.windowFrameStart();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2277;
                this.match(Sql.UNBOUNDED);
                this.state = 2278;
                this.match(Sql.FOLLOWING);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 2279;
                this.windowFrameFollowing();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowFrameFollowing(): WindowFrameFollowingContext {
        let localContext = new WindowFrameFollowingContext(this.context, this.state);
        this.enterRule(localContext, 216, Sql.RULE_windowFrameFollowing);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2282;
            this.match(Sql.UNSIGNED_INTEGER);
            this.state = 2283;
            this.match(Sql.FOLLOWING);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public windowFrameExclusion(): WindowFrameExclusionContext {
        let localContext = new WindowFrameExclusionContext(this.context, this.state);
        this.enterRule(localContext, 218, Sql.RULE_windowFrameExclusion);
        try {
            this.state = 2295;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 244, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2285;
                this.match(Sql.EXCLUDE);
                this.state = 2286;
                this.match(Sql.CURRENT);
                this.state = 2287;
                this.match(Sql.ROW);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2288;
                this.match(Sql.EXCLUDE);
                this.state = 2289;
                this.match(Sql.GROUP);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 2290;
                this.match(Sql.EXCLUDE);
                this.state = 2291;
                this.match(Sql.TIES);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 2292;
                this.match(Sql.EXCLUDE);
                this.state = 2293;
                this.match(Sql.NO);
                this.state = 2294;
                this.match(Sql.OTHERS);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public selectClause(): SelectClauseContext {
        let localContext = new SelectClauseContext(this.context, this.state);
        this.enterRule(localContext, 220, Sql.RULE_selectClause);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2297;
            this.match(Sql.SELECT);
            this.state = 2299;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 245, this.context) ) {
            case 1:
                {
                this.state = 2298;
                this.setQuantifier();
                }
                break;
            }
            this.state = 2301;
            this.selectList();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public selectList(): SelectListContext {
        let localContext = new SelectListContext(this.context, this.state);
        this.enterRule(localContext, 222, Sql.RULE_selectList);
        try {
            let alternative: number;
            this.state = 2329;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 252, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2303;
                this.selectListAsterisk();
                this.state = 2310;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 247, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 2304;
                        this.match(Sql.COMMA);
                        this.state = 2306;
                        this.errorHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this.tokenStream, 246, this.context) ) {
                        case 1:
                            {
                            this.state = 2305;
                            this.selectSublist();
                            }
                            break;
                        }
                        }
                        }
                    }
                    this.state = 2312;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 247, this.context);
                }
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2314;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 248, this.context) ) {
                case 1:
                    {
                    this.state = 2313;
                    this.selectSublist();
                    }
                    break;
                }
                this.state = 2322;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 250, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 2316;
                        this.match(Sql.COMMA);
                        this.state = 2318;
                        this.errorHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this.tokenStream, 249, this.context) ) {
                        case 1:
                            {
                            this.state = 2317;
                            this.selectSublist();
                            }
                            break;
                        }
                        }
                        }
                    }
                    this.state = 2324;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 250, this.context);
                }
                this.state = 2327;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 251, this.context) ) {
                case 1:
                    {
                    this.state = 2325;
                    this.match(Sql.COMMA);
                    this.state = 2326;
                    this.selectListAsterisk();
                    }
                    break;
                }
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public selectListAsterisk(): SelectListAsteriskContext {
        let localContext = new SelectListAsteriskContext(this.context, this.state);
        this.enterRule(localContext, 224, Sql.RULE_selectListAsterisk);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2331;
            this.match(Sql.ASTERISK);
            this.state = 2333;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 253, this.context) ) {
            case 1:
                {
                this.state = 2332;
                this.excludeClause();
                }
                break;
            }
            this.state = 2336;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 254, this.context) ) {
            case 1:
                {
                this.state = 2335;
                this.renameClause();
                }
                break;
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public selectSublist(): SelectSublistContext {
        let localContext = new SelectSublistContext(this.context, this.state);
        this.enterRule(localContext, 226, Sql.RULE_selectSublist);
        try {
            this.state = 2340;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 255, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2338;
                this.derivedColumn();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2339;
                this.qualifiedAsterisk();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public qualifiedAsterisk(): QualifiedAsteriskContext {
        let localContext = new QualifiedAsteriskContext(this.context, this.state);
        this.enterRule(localContext, 228, Sql.RULE_qualifiedAsterisk);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2342;
            this.identifierChain();
            this.state = 2343;
            this.match(Sql.DOT);
            this.state = 2344;
            this.match(Sql.ASTERISK);
            this.state = 2346;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 256, this.context) ) {
            case 1:
                {
                this.state = 2345;
                this.excludeClause();
                }
                break;
            }
            this.state = 2349;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 257, this.context) ) {
            case 1:
                {
                this.state = 2348;
                this.qualifiedRenameClause();
                }
                break;
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public renameClause(): RenameClauseContext {
        let localContext = new RenameClauseContext(this.context, this.state);
        this.enterRule(localContext, 230, Sql.RULE_renameClause);
        let _la: number;
        try {
            this.state = 2365;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 259, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2351;
                this.match(Sql.RENAME);
                this.state = 2352;
                this.renameColumn();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2353;
                this.match(Sql.RENAME);
                this.state = 2354;
                this.match(Sql.LPAREN);
                this.state = 2355;
                this.renameColumn();
                this.state = 2360;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 10) {
                    {
                    {
                    this.state = 2356;
                    this.match(Sql.COMMA);
                    this.state = 2357;
                    this.renameColumn();
                    }
                    }
                    this.state = 2362;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 2363;
                this.match(Sql.RPAREN);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public renameColumn(): RenameColumnContext {
        let localContext = new RenameColumnContext(this.context, this.state);
        this.enterRule(localContext, 232, Sql.RULE_renameColumn);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2367;
            this.columnReference();
            this.state = 2368;
            this.asClause();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public qualifiedRenameClause(): QualifiedRenameClauseContext {
        let localContext = new QualifiedRenameClauseContext(this.context, this.state);
        this.enterRule(localContext, 234, Sql.RULE_qualifiedRenameClause);
        let _la: number;
        try {
            this.state = 2384;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 261, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2370;
                this.match(Sql.RENAME);
                this.state = 2371;
                this.qualifiedRenameColumn();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2372;
                this.match(Sql.RENAME);
                this.state = 2373;
                this.match(Sql.LPAREN);
                this.state = 2374;
                this.qualifiedRenameColumn();
                this.state = 2379;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 10) {
                    {
                    {
                    this.state = 2375;
                    this.match(Sql.COMMA);
                    this.state = 2376;
                    this.qualifiedRenameColumn();
                    }
                    }
                    this.state = 2381;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 2382;
                this.match(Sql.RPAREN);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public qualifiedRenameColumn(): QualifiedRenameColumnContext {
        let localContext = new QualifiedRenameColumnContext(this.context, this.state);
        this.enterRule(localContext, 236, Sql.RULE_qualifiedRenameColumn);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2386;
            this.identifier();
            this.state = 2387;
            this.asClause();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public excludeClause(): ExcludeClauseContext {
        let localContext = new ExcludeClauseContext(this.context, this.state);
        this.enterRule(localContext, 238, Sql.RULE_excludeClause);
        let _la: number;
        try {
            this.state = 2403;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 263, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2389;
                this.match(Sql.EXCLUDE);
                this.state = 2390;
                this.identifier();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2391;
                this.match(Sql.EXCLUDE);
                this.state = 2392;
                this.match(Sql.LPAREN);
                this.state = 2393;
                this.identifier();
                this.state = 2398;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 10) {
                    {
                    {
                    this.state = 2394;
                    this.match(Sql.COMMA);
                    this.state = 2395;
                    this.identifier();
                    }
                    }
                    this.state = 2400;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 2401;
                this.match(Sql.RPAREN);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public derivedColumn(): DerivedColumnContext {
        let localContext = new DerivedColumnContext(this.context, this.state);
        this.enterRule(localContext, 240, Sql.RULE_derivedColumn);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2405;
            this.expr(0);
            this.state = 2407;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 264, this.context) ) {
            case 1:
                {
                this.state = 2406;
                this.asClause();
                }
                break;
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public asClause(): AsClauseContext {
        let localContext = new AsClauseContext(this.context, this.state);
        this.enterRule(localContext, 242, Sql.RULE_asClause);
        try {
            this.state = 2415;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.AS:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2409;
                this.match(Sql.AS);
                this.state = 2412;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case Sql.AT:
                case Sql.ATTACH:
                case Sql.AVG:
                case Sql.BETWEEN:
                case Sql.BIGINT:
                case Sql.BOOL:
                case Sql.BOOLEAN:
                case Sql.BOOL_AND:
                case Sql.BOOL_OR:
                case Sql.BPCHAR:
                case Sql.BY:
                case Sql.BYTEA:
                case Sql.CHAR:
                case Sql.COMMITTED:
                case Sql.COPY:
                case Sql.COUNT:
                case Sql.CUME_DIST:
                case Sql.CURRENT:
                case Sql.CURRENT_USER:
                case Sql.DATABASE:
                case Sql.DATE:
                case Sql.DAY:
                case Sql.DEC:
                case Sql.DECIMAL:
                case Sql.DELETE:
                case Sql.DENSE_RANK:
                case Sql.DETACH:
                case Sql.DISCARD:
                case Sql.DOUBLE:
                case Sql.DOW:
                case Sql.DOY:
                case Sql.DURATION:
                case Sql.END:
                case Sql.EPOCH:
                case Sql.ERASE:
                case Sql.EVERY:
                case Sql.FILTER:
                case Sql.FIRST:
                case Sql.FLOAT:
                case Sql.FLOAT4:
                case Sql.FLOAT8:
                case Sql.FORMAT:
                case Sql.HOUR:
                case Sql.INSERT:
                case Sql.INT:
                case Sql.INT2:
                case Sql.INT4:
                case Sql.INT8:
                case Sql.INTEGER:
                case Sql.INTERVAL:
                case Sql.ISODOW:
                case Sql.KEYWORD:
                case Sql.LAST:
                case Sql.LEVEL:
                case Sql.MAX:
                case Sql.METADATA:
                case Sql.MIN:
                case Sql.MINUTE:
                case Sql.MONTH:
                case Sql.NAME:
                case Sql.NEXT:
                case Sql.NUMERIC:
                case Sql.OBJECT:
                case Sql.OF:
                case Sql.OID:
                case Sql.PASSWORD:
                case Sql.PERCENT_RANK:
                case Sql.PERIOD:
                case Sql.PLANS:
                case Sql.POSITION:
                case Sql.PRECISION:
                case Sql.QUARTER:
                case Sql.RANK:
                case Sql.REAL:
                case Sql.RECORD:
                case Sql.REGCLASS:
                case Sql.REGPROC:
                case Sql.ROLE:
                case Sql.ROW:
                case Sql.SECOND:
                case Sql.SELECT:
                case Sql.SEQUENCES:
                case Sql.SETTING:
                case Sql.SMALLINT:
                case Sql.START:
                case Sql.STDDEV_POP:
                case Sql.STDDEV_SAMP:
                case Sql.SUM:
                case Sql.SYNC:
                case Sql.SYSTEM_TIME:
                case Sql.TABLE:
                case Sql.TEMP:
                case Sql.TEMPORARY:
                case Sql.TEXT:
                case Sql.TIME:
                case Sql.TIMESTAMP:
                case Sql.TIMESTAMPTZ:
                case Sql.TIMEZONE:
                case Sql.TSTZRANGE:
                case Sql.UNCOMMITTED:
                case Sql.UPDATE:
                case Sql.URI:
                case Sql.USER:
                case Sql.UUID:
                case Sql.VALID_TIME:
                case Sql.VARCHAR:
                case Sql.VAR_POP:
                case Sql.VAR_SAMP:
                case Sql.VARBINARY:
                case Sql.VERSION:
                case Sql.WEEK:
                case Sql.YEAR:
                case Sql.REGULAR_IDENTIFIER:
                case Sql.DELIMITED_IDENTIFIER:
                    {
                    this.state = 2410;
                    this.columnLabel();
                    }
                    break;
                case Sql.DEFAULT:
                    {
                    this.state = 2411;
                    this.match(Sql.DEFAULT);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            case Sql.AT:
            case Sql.ATTACH:
            case Sql.AVG:
            case Sql.BETWEEN:
            case Sql.BIGINT:
            case Sql.BOOL:
            case Sql.BOOLEAN:
            case Sql.BOOL_AND:
            case Sql.BOOL_OR:
            case Sql.BPCHAR:
            case Sql.BY:
            case Sql.BYTEA:
            case Sql.CHAR:
            case Sql.COMMITTED:
            case Sql.COPY:
            case Sql.COUNT:
            case Sql.CUME_DIST:
            case Sql.CURRENT:
            case Sql.CURRENT_USER:
            case Sql.DATABASE:
            case Sql.DATE:
            case Sql.DAY:
            case Sql.DEC:
            case Sql.DECIMAL:
            case Sql.DELETE:
            case Sql.DENSE_RANK:
            case Sql.DETACH:
            case Sql.DISCARD:
            case Sql.DOUBLE:
            case Sql.DOW:
            case Sql.DOY:
            case Sql.DURATION:
            case Sql.END:
            case Sql.EPOCH:
            case Sql.ERASE:
            case Sql.EVERY:
            case Sql.FILTER:
            case Sql.FIRST:
            case Sql.FLOAT:
            case Sql.FLOAT4:
            case Sql.FLOAT8:
            case Sql.FORMAT:
            case Sql.HOUR:
            case Sql.INSERT:
            case Sql.INT:
            case Sql.INT2:
            case Sql.INT4:
            case Sql.INT8:
            case Sql.INTEGER:
            case Sql.INTERVAL:
            case Sql.ISODOW:
            case Sql.KEYWORD:
            case Sql.LAST:
            case Sql.LEVEL:
            case Sql.MAX:
            case Sql.METADATA:
            case Sql.MIN:
            case Sql.MINUTE:
            case Sql.MONTH:
            case Sql.NAME:
            case Sql.NEXT:
            case Sql.NUMERIC:
            case Sql.OBJECT:
            case Sql.OF:
            case Sql.OID:
            case Sql.PASSWORD:
            case Sql.PERCENT_RANK:
            case Sql.PERIOD:
            case Sql.PLANS:
            case Sql.POSITION:
            case Sql.PRECISION:
            case Sql.QUARTER:
            case Sql.RANK:
            case Sql.REAL:
            case Sql.RECORD:
            case Sql.REGCLASS:
            case Sql.REGPROC:
            case Sql.ROLE:
            case Sql.ROW:
            case Sql.SECOND:
            case Sql.SELECT:
            case Sql.SEQUENCES:
            case Sql.SETTING:
            case Sql.SMALLINT:
            case Sql.START:
            case Sql.STDDEV_POP:
            case Sql.STDDEV_SAMP:
            case Sql.SUM:
            case Sql.SYNC:
            case Sql.SYSTEM_TIME:
            case Sql.TABLE:
            case Sql.TEMP:
            case Sql.TEMPORARY:
            case Sql.TEXT:
            case Sql.TIME:
            case Sql.TIMESTAMP:
            case Sql.TIMESTAMPTZ:
            case Sql.TIMEZONE:
            case Sql.TSTZRANGE:
            case Sql.UNCOMMITTED:
            case Sql.UPDATE:
            case Sql.URI:
            case Sql.USER:
            case Sql.UUID:
            case Sql.VALID_TIME:
            case Sql.VARCHAR:
            case Sql.VAR_POP:
            case Sql.VAR_SAMP:
            case Sql.VARBINARY:
            case Sql.VERSION:
            case Sql.WEEK:
            case Sql.YEAR:
            case Sql.REGULAR_IDENTIFIER:
            case Sql.DELIMITED_IDENTIFIER:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2414;
                this.columnLabel();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public queryExpression(): QueryExpressionContext {
        let localContext = new QueryExpressionContext(this.context, this.state);
        this.enterRule(localContext, 244, Sql.RULE_queryExpression);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2418;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 358) {
                {
                this.state = 2417;
                this.withClause();
                }
            }

            this.state = 2420;
            this.queryExpressionNoWith();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public queryExpressionNoWith(): QueryExpressionNoWithContext {
        let localContext = new QueryExpressionNoWithContext(this.context, this.state);
        this.enterRule(localContext, 246, Sql.RULE_queryExpressionNoWith);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2422;
            this.queryExpressionBody(0);
            this.state = 2424;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 233) {
                {
                this.state = 2423;
                this.orderByClause();
                }
            }

            this.state = 2427;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 140 || _la === 194 || _la === 228) {
                {
                this.state = 2426;
                this.offsetAndLimit();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public withClause(): WithClauseContext {
        let localContext = new WithClauseContext(this.context, this.state);
        this.enterRule(localContext, 248, Sql.RULE_withClause);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2429;
            this.match(Sql.WITH);
            this.state = 2431;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 270) {
                {
                this.state = 2430;
                this.match(Sql.RECURSIVE);
                }
            }

            this.state = 2433;
            this.withListElement();
            this.state = 2438;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 10) {
                {
                {
                this.state = 2434;
                this.match(Sql.COMMA);
                this.state = 2435;
                this.withListElement();
                }
                }
                this.state = 2440;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public withListElement(): WithListElementContext {
        let localContext = new WithListElementContext(this.context, this.state);
        this.enterRule(localContext, 250, Sql.RULE_withListElement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2442;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 199) {
                {
                this.state = 2441;
                this.match(Sql.MATERIALIZED);
                }
            }

            this.state = 2444;
            localContext._queryName = this.identifier();
            this.state = 2449;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 15) {
                {
                this.state = 2445;
                this.match(Sql.LPAREN);
                this.state = 2446;
                this.columnNameList();
                this.state = 2447;
                this.match(Sql.RPAREN);
                }
            }

            this.state = 2451;
            this.match(Sql.AS);
            this.state = 2452;
            this.subquery();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public queryExpressionBody(): QueryExpressionBodyContext;
    public queryExpressionBody(_p: number): QueryExpressionBodyContext;
    public queryExpressionBody(_p?: number): QueryExpressionBodyContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new QueryExpressionBodyContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 252;
        this.enterRecursionRule(localContext, 252, Sql.RULE_queryExpressionBody, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2496;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.SELECT:
                {
                localContext = new QuerySpecificationContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 2455;
                this.selectClause();
                this.state = 2457;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 274, this.context) ) {
                case 1:
                    {
                    this.state = 2456;
                    this.fromClause();
                    }
                    break;
                }
                this.state = 2460;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 275, this.context) ) {
                case 1:
                    {
                    this.state = 2459;
                    this.whereClause();
                    }
                    break;
                }
                this.state = 2463;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 276, this.context) ) {
                case 1:
                    {
                    this.state = 2462;
                    this.groupByClause();
                    }
                    break;
                }
                this.state = 2466;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 277, this.context) ) {
                case 1:
                    {
                    this.state = 2465;
                    this.havingClause();
                    }
                    break;
                }
                this.state = 2469;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 278, this.context) ) {
                case 1:
                    {
                    this.state = 2468;
                    this.windowClause();
                    }
                    break;
                }
                }
                break;
            case Sql.FROM:
                {
                localContext = new QuerySpecificationContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 2471;
                this.fromClause();
                this.state = 2475;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 279, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        {
                        this.state = 2472;
                        this.queryTail();
                        }
                        }
                    }
                    this.state = 2477;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 279, this.context);
                }
                this.state = 2479;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 280, this.context) ) {
                case 1:
                    {
                    this.state = 2478;
                    this.windowClause();
                    }
                    break;
                }
                }
                break;
            case Sql.VALUES:
                {
                localContext = new ValuesQueryContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 2481;
                this.tableValueConstructor();
                }
                break;
            case Sql.RECORDS:
                {
                localContext = new RecordsQueryContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 2482;
                this.recordsValueConstructor();
                }
                break;
            case Sql.LPAREN:
                {
                localContext = new WrappedQueryContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 2483;
                this.match(Sql.LPAREN);
                this.state = 2484;
                this.queryExpressionNoWith();
                this.state = 2485;
                this.match(Sql.RPAREN);
                }
                break;
            case Sql.XTQL:
                {
                localContext = new XtqlQueryContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 2487;
                this.match(Sql.XTQL);
                this.state = 2494;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case Sql.CHARACTER_STRING:
                case Sql.C_ESCAPES_STRING:
                case Sql.DOLLAR_TAG:
                    {
                    this.state = 2488;
                    (localContext as XtqlQueryContext)._xtqlQuery = this.characterString();
                    }
                    break;
                case Sql.LPAREN:
                    {
                    this.state = 2489;
                    this.match(Sql.LPAREN);
                    this.state = 2490;
                    (localContext as XtqlQueryContext)._xtqlQuery = this.characterString();
                    this.state = 2491;
                    this.xtqlParams();
                    this.state = 2492;
                    this.match(Sql.RPAREN);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 2512;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 286, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 2510;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 285, this.context) ) {
                    case 1:
                        {
                        localContext = new IntersectQueryContext(new QueryExpressionBodyContext(parentContext, parentState));
                        (localContext as IntersectQueryContext)._left = previousContext;
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_queryExpressionBody);
                        this.state = 2498;
                        if (!(this.precpred(this.context, 2))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 2)");
                        }
                        this.state = 2499;
                        this.match(Sql.INTERSECT);
                        this.state = 2501;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        if (_la === 48 || _la === 119) {
                            {
                            this.state = 2500;
                            _la = this.tokenStream.LA(1);
                            if(!(_la === 48 || _la === 119)) {
                            this.errorHandler.recoverInline(this);
                            }
                            else {
                                this.errorHandler.reportMatch(this);
                                this.consume();
                            }
                            }
                        }

                        this.state = 2503;
                        (localContext as IntersectQueryContext)._right = this.queryExpressionBody(3);
                        }
                        break;
                    case 2:
                        {
                        localContext = new UnionOrExceptQueryContext(new QueryExpressionBodyContext(parentContext, parentState));
                        (localContext as UnionOrExceptQueryContext)._left = previousContext;
                        this.pushNewRecursionContext(localContext, _startState, Sql.RULE_queryExpressionBody);
                        this.state = 2504;
                        if (!(this.precpred(this.context, 1))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 1)");
                        }
                        this.state = 2505;
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 133 || _la === 330)) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 2507;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                        if (_la === 48 || _la === 119) {
                            {
                            this.state = 2506;
                            _la = this.tokenStream.LA(1);
                            if(!(_la === 48 || _la === 119)) {
                            this.errorHandler.recoverInline(this);
                            }
                            else {
                                this.errorHandler.reportMatch(this);
                                this.consume();
                            }
                            }
                        }

                        this.state = 2509;
                        (localContext as UnionOrExceptQueryContext)._right = this.queryExpressionBody(2);
                        }
                        break;
                    }
                    }
                }
                this.state = 2514;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 286, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public xtqlParams(): XtqlParamsContext {
        let localContext = new XtqlParamsContext(this.context, this.state);
        this.enterRule(localContext, 254, Sql.RULE_xtqlParams);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2519;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 10) {
                {
                {
                this.state = 2515;
                this.match(Sql.COMMA);
                this.state = 2516;
                this.parameterSpecification();
                }
                }
                this.state = 2521;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public queryTail(): QueryTailContext {
        let localContext = new QueryTailContext(this.context, this.state);
        this.enterRule(localContext, 256, Sql.RULE_queryTail);
        let _la: number;
        try {
            this.state = 2530;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.WHERE:
                localContext = new WhereTailContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2522;
                this.whereClause();
                }
                break;
            case Sql.GROUP:
            case Sql.HAVING:
            case Sql.SELECT:
                localContext = new SelectTailContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2524;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 156) {
                    {
                    this.state = 2523;
                    this.groupByClause();
                    }
                }

                this.state = 2527;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 161) {
                    {
                    this.state = 2526;
                    this.havingClause();
                    }
                }

                this.state = 2529;
                this.selectClause();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public orderByClause(): OrderByClauseContext {
        let localContext = new OrderByClauseContext(this.context, this.state);
        this.enterRule(localContext, 258, Sql.RULE_orderByClause);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2532;
            this.match(Sql.ORDER);
            this.state = 2533;
            this.match(Sql.BY);
            this.state = 2534;
            this.sortSpecificationList();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public offsetAndLimit(): OffsetAndLimitContext {
        let localContext = new OffsetAndLimitContext(this.context, this.state);
        this.enterRule(localContext, 260, Sql.RULE_offsetAndLimit);
        let _la: number;
        try {
            this.state = 2544;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.OFFSET:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2536;
                this.resultOffsetClause();
                this.state = 2538;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 140 || _la === 194) {
                    {
                    this.state = 2537;
                    this.fetchFirstClause();
                    }
                }

                }
                break;
            case Sql.FETCH:
            case Sql.LIMIT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2540;
                this.fetchFirstClause();
                this.state = 2542;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 228) {
                    {
                    this.state = 2541;
                    this.resultOffsetClause();
                    }
                }

                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public resultOffsetClause(): ResultOffsetClauseContext {
        let localContext = new ResultOffsetClauseContext(this.context, this.state);
        this.enterRule(localContext, 262, Sql.RULE_resultOffsetClause);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2546;
            this.match(Sql.OFFSET);
            this.state = 2547;
            this.offsetRowCount();
            this.state = 2549;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 283 || _la === 284) {
                {
                this.state = 2548;
                _la = this.tokenStream.LA(1);
                if(!(_la === 283 || _la === 284)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public fetchFirstClause(): FetchFirstClauseContext {
        let localContext = new FetchFirstClauseContext(this.context, this.state);
        this.enterRule(localContext, 264, Sql.RULE_fetchFirstClause);
        let _la: number;
        try {
            this.state = 2560;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.FETCH:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2551;
                this.match(Sql.FETCH);
                this.state = 2552;
                _la = this.tokenStream.LA(1);
                if(!(_la === 142 || _la === 213)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 2554;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 16928) !== 0)) {
                    {
                    this.state = 2553;
                    this.fetchFirstRowCount();
                    }
                }

                this.state = 2556;
                _la = this.tokenStream.LA(1);
                if(!(_la === 283 || _la === 284)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 2557;
                this.match(Sql.ONLY);
                }
                break;
            case Sql.LIMIT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2558;
                this.match(Sql.LIMIT);
                this.state = 2559;
                this.fetchFirstRowCount();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public offsetRowCount(): OffsetRowCountContext {
        let localContext = new OffsetRowCountContext(this.context, this.state);
        this.enterRule(localContext, 266, Sql.RULE_offsetRowCount);
        try {
            this.state = 2564;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.UNSIGNED_INTEGER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2562;
                this.match(Sql.UNSIGNED_INTEGER);
                }
                break;
            case Sql.POSTGRES_PARAMETER_SPECIFICATION:
            case Sql.QUESTION:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2563;
                this.parameterSpecification();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public fetchFirstRowCount(): FetchFirstRowCountContext {
        let localContext = new FetchFirstRowCountContext(this.context, this.state);
        this.enterRule(localContext, 268, Sql.RULE_fetchFirstRowCount);
        try {
            this.state = 2568;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.UNSIGNED_INTEGER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2566;
                this.match(Sql.UNSIGNED_INTEGER);
                }
                break;
            case Sql.POSTGRES_PARAMETER_SPECIFICATION:
            case Sql.QUESTION:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2567;
                this.parameterSpecification();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public subquery(): SubqueryContext {
        let localContext = new SubqueryContext(this.context, this.state);
        this.enterRule(localContext, 270, Sql.RULE_subquery);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2570;
            this.match(Sql.LPAREN);
            this.state = 2571;
            this.queryExpression();
            this.state = 2572;
            this.match(Sql.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public predicatePart2(): PredicatePart2Context {
        let localContext = new PredicatePart2Context(this.context, this.state);
        this.enterRule(localContext, 272, Sql.RULE_predicatePart2);
        let _la: number;
        try {
            this.state = 2630;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 308, this.context) ) {
            case 1:
                localContext = new ComparisonPredicatePart2Context(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2574;
                this.compOp();
                this.state = 2575;
                this.expr(0);
                }
                break;
            case 2:
                localContext = new BetweenPredicatePart2Context(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2578;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 216) {
                    {
                    this.state = 2577;
                    this.match(Sql.NOT);
                    }
                }

                this.state = 2580;
                this.match(Sql.BETWEEN);
                this.state = 2582;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 58 || _la === 306) {
                    {
                    this.state = 2581;
                    _la = this.tokenStream.LA(1);
                    if(!(_la === 58 || _la === 306)) {
                    this.errorHandler.recoverInline(this);
                    }
                    else {
                        this.errorHandler.reportMatch(this);
                        this.consume();
                    }
                    }
                }

                this.state = 2584;
                this.commonValueExpr(0);
                this.state = 2585;
                this.match(Sql.AND);
                this.state = 2586;
                this.commonValueExpr(0);
                }
                break;
            case 3:
                localContext = new InPredicatePart2Context(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 2589;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 216) {
                    {
                    this.state = 2588;
                    this.match(Sql.NOT);
                    }
                }

                this.state = 2591;
                this.match(Sql.IN);
                this.state = 2592;
                this.inPredicateValue();
                }
                break;
            case 4:
                localContext = new LikePredicatePart2Context(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 2594;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 216) {
                    {
                    this.state = 2593;
                    this.match(Sql.NOT);
                    }
                }

                this.state = 2596;
                _la = this.tokenStream.LA(1);
                if(!(_la === 191 || _la === 192)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 2597;
                (localContext as LikePredicatePart2Context)._likePattern = this.commonValueExpr(0);
                this.state = 2600;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 131) {
                    {
                    this.state = 2598;
                    this.match(Sql.ESCAPE);
                    this.state = 2599;
                    (localContext as LikePredicatePart2Context)._likeEscape = this.commonValueExpr(0);
                    }
                }

                }
                break;
            case 5:
                localContext = new LikeRegexPredicatePart2Context(localContext);
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 2603;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 216) {
                    {
                    this.state = 2602;
                    this.match(Sql.NOT);
                    }
                }

                this.state = 2605;
                this.match(Sql.LIKE_REGEX);
                this.state = 2606;
                (localContext as LikeRegexPredicatePart2Context)._xqueryPattern = this.commonValueExpr(0);
                this.state = 2609;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 144) {
                    {
                    this.state = 2607;
                    this.match(Sql.FLAG);
                    this.state = 2608;
                    (localContext as LikeRegexPredicatePart2Context)._xqueryOptionFlag = this.commonValueExpr(0);
                    }
                }

                }
                break;
            case 6:
                localContext = new PostgresRegexPredicatePart2Context(localContext);
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 2611;
                this.postgresRegexOperator();
                this.state = 2612;
                (localContext as PostgresRegexPredicatePart2Context)._xqueryPattern = this.commonValueExpr(0);
                }
                break;
            case 7:
                localContext = new NullPredicatePart2Context(localContext);
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 2614;
                this.match(Sql.IS);
                this.state = 2616;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 216) {
                    {
                    this.state = 2615;
                    this.match(Sql.NOT);
                    }
                }

                this.state = 2618;
                this.match(Sql.NULL);
                }
                break;
            case 8:
                localContext = new DistinctFromPredicatePart2Context(localContext);
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 2619;
                this.match(Sql.IS);
                this.state = 2621;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 216) {
                    {
                    this.state = 2620;
                    this.match(Sql.NOT);
                    }
                }

                this.state = 2623;
                this.match(Sql.DISTINCT);
                this.state = 2624;
                this.match(Sql.FROM);
                this.state = 2625;
                this.expr(0);
                }
                break;
            case 9:
                localContext = new QuantifiedComparisonPredicatePart2Context(localContext);
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 2626;
                this.compOp();
                this.state = 2627;
                this.quantifier();
                this.state = 2628;
                this.quantifiedComparisonPredicatePart3();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public quantifiedComparisonPredicatePart3(): QuantifiedComparisonPredicatePart3Context {
        let localContext = new QuantifiedComparisonPredicatePart3Context(this.context, this.state);
        this.enterRule(localContext, 274, Sql.RULE_quantifiedComparisonPredicatePart3);
        try {
            this.state = 2634;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 309, this.context) ) {
            case 1:
                localContext = new QuantifiedComparisonSubqueryContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2632;
                this.subquery();
                }
                break;
            case 2:
                localContext = new QuantifiedComparisonExprContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2633;
                this.expr(0);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public compOp(): CompOpContext {
        let localContext = new CompOpContext(this.context, this.state);
        this.enterRule(localContext, 276, Sql.RULE_compOp);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2636;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 127) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public inPredicateValue(): InPredicateValueContext {
        let localContext = new InPredicateValueContext(this.context, this.state);
        this.enterRule(localContext, 278, Sql.RULE_inPredicateValue);
        try {
            this.state = 2643;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 310, this.context) ) {
            case 1:
                localContext = new InSubqueryContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2638;
                this.subquery();
                }
                break;
            case 2:
                localContext = new InRowValueListContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2639;
                this.match(Sql.LPAREN);
                this.state = 2640;
                this.rowValueList();
                this.state = 2641;
                this.match(Sql.RPAREN);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public postgresRegexOperator(): PostgresRegexOperatorContext {
        let localContext = new PostgresRegexOperatorContext(this.context, this.state);
        this.enterRule(localContext, 280, Sql.RULE_postgresRegexOperator);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2645;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 22)) & ~0x1F) === 0 && ((1 << (_la - 22)) & 58720257) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public quantifier(): QuantifierContext {
        let localContext = new QuantifierContext(this.context, this.state);
        this.enterRule(localContext, 282, Sql.RULE_quantifier);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2647;
            _la = this.tokenStream.LA(1);
            if(!(_la === 48 || _la === 52 || _la === 297)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public searchCondition(): SearchConditionContext {
        let localContext = new SearchConditionContext(this.context, this.state);
        this.enterRule(localContext, 284, Sql.RULE_searchCondition);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2650;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 311, this.context) ) {
            case 1:
                {
                this.state = 2649;
                this.expr(0);
                }
                break;
            }
            this.state = 2658;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 313, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 2652;
                    this.match(Sql.COMMA);
                    this.state = 2654;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 312, this.context) ) {
                    case 1:
                        {
                        this.state = 2653;
                        this.expr(0);
                        }
                        break;
                    }
                    }
                    }
                }
                this.state = 2660;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 313, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public aggregateFunction(): AggregateFunctionContext {
        let localContext = new AggregateFunctionContext(this.context, this.state);
        this.enterRule(localContext, 286, Sql.RULE_aggregateFunction);
        let _la: number;
        try {
            this.state = 2704;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 320, this.context) ) {
            case 1:
                localContext = new CountStarFunctionContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2661;
                this.match(Sql.COUNT);
                this.state = 2662;
                this.match(Sql.LPAREN);
                this.state = 2663;
                this.match(Sql.ASTERISK);
                this.state = 2664;
                this.match(Sql.RPAREN);
                this.state = 2666;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 314, this.context) ) {
                case 1:
                    {
                    this.state = 2665;
                    this.aggregateFilterClause();
                    }
                    break;
                }
                }
                break;
            case 2:
                localContext = new ArrayAggFunctionContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2668;
                this.match(Sql.ARRAY_AGG);
                this.state = 2669;
                this.match(Sql.LPAREN);
                this.state = 2670;
                this.expr(0);
                this.state = 2674;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 233) {
                    {
                    this.state = 2671;
                    this.match(Sql.ORDER);
                    this.state = 2672;
                    this.match(Sql.BY);
                    this.state = 2673;
                    this.sortSpecificationList();
                    }
                }

                this.state = 2676;
                this.match(Sql.RPAREN);
                this.state = 2678;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 316, this.context) ) {
                case 1:
                    {
                    this.state = 2677;
                    this.aggregateFilterClause();
                    }
                    break;
                }
                }
                break;
            case 3:
                localContext = new SetFunctionContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 2680;
                this.setFunctionType();
                this.state = 2681;
                this.match(Sql.LPAREN);
                this.state = 2683;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 48 || _la === 119) {
                    {
                    this.state = 2682;
                    this.setQuantifier();
                    }
                }

                this.state = 2685;
                this.expr(0);
                this.state = 2686;
                this.match(Sql.RPAREN);
                this.state = 2688;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 318, this.context) ) {
                case 1:
                    {
                    this.state = 2687;
                    this.aggregateFilterClause();
                    }
                    break;
                }
                }
                break;
            case 4:
                localContext = new OrderedSetFunctionContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 2690;
                this.orderedSetFunctionType();
                this.state = 2691;
                this.match(Sql.LPAREN);
                this.state = 2692;
                this.percentileFraction();
                this.state = 2693;
                this.match(Sql.RPAREN);
                this.state = 2694;
                this.match(Sql.WITHIN);
                this.state = 2695;
                this.match(Sql.GROUP);
                this.state = 2696;
                this.match(Sql.LPAREN);
                this.state = 2697;
                this.match(Sql.ORDER);
                this.state = 2698;
                this.match(Sql.BY);
                this.state = 2699;
                this.sortSpecification();
                this.state = 2700;
                this.match(Sql.RPAREN);
                this.state = 2702;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 319, this.context) ) {
                case 1:
                    {
                    this.state = 2701;
                    this.aggregateFilterClause();
                    }
                    break;
                }
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public aggregateFilterClause(): AggregateFilterClauseContext {
        let localContext = new AggregateFilterClauseContext(this.context, this.state);
        this.enterRule(localContext, 288, Sql.RULE_aggregateFilterClause);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2706;
            this.match(Sql.FILTER);
            this.state = 2707;
            this.match(Sql.LPAREN);
            this.state = 2708;
            this.match(Sql.WHERE);
            this.state = 2709;
            this.expr(0);
            this.state = 2710;
            this.match(Sql.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public percentileFraction(): PercentileFractionContext {
        let localContext = new PercentileFractionContext(this.context, this.state);
        this.enterRule(localContext, 290, Sql.RULE_percentileFraction);
        try {
            this.state = 2714;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.UNSIGNED_FLOAT:
            case Sql.UNSIGNED_INTEGER:
            case Sql.CHARACTER_STRING:
            case Sql.C_ESCAPES_STRING:
            case Sql.BINARY_STRING:
            case Sql.PLUS:
            case Sql.MINUS:
            case Sql.DATE:
            case Sql.DURATION:
            case Sql.FALSE:
            case Sql.INTERVAL:
            case Sql.KEYWORD:
            case Sql.NULL:
            case Sql.OFF:
            case Sql.ON:
            case Sql.TIME:
            case Sql.TIMESTAMP:
            case Sql.TRUE:
            case Sql.URI:
            case Sql.UUID:
            case Sql.DOLLAR_TAG:
                localContext = new PercentileFractionLiteralContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2712;
                this.literal();
                }
                break;
            case Sql.POSTGRES_PARAMETER_SPECIFICATION:
            case Sql.QUESTION:
                localContext = new PercentileFractionParamContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2713;
                this.parameterSpecification();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public orderedSetFunctionType(): OrderedSetFunctionTypeContext {
        let localContext = new OrderedSetFunctionTypeContext(this.context, this.state);
        this.enterRule(localContext, 292, Sql.RULE_orderedSetFunctionType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2716;
            _la = this.tokenStream.LA(1);
            if(!(_la === 258 || _la === 259)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public setFunctionType(): SetFunctionTypeContext {
        let localContext = new SetFunctionTypeContext(this.context, this.state);
        this.enterRule(localContext, 294, Sql.RULE_setFunctionType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2718;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 62)) & ~0x1F) === 0 && ((1 << (_la - 62)) & 536872449) !== 0) || _la === 132 || _la === 200 || _la === 205 || ((((_la - 299)) & ~0x1F) === 0 && ((1 << (_la - 299)) & 67) !== 0) || _la === 349 || _la === 350)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public setQuantifier(): SetQuantifierContext {
        let localContext = new SetQuantifierContext(this.context, this.state);
        this.enterRule(localContext, 296, Sql.RULE_setQuantifier);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2720;
            _la = this.tokenStream.LA(1);
            if(!(_la === 48 || _la === 119)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public sortSpecificationList(): SortSpecificationListContext {
        let localContext = new SortSpecificationListContext(this.context, this.state);
        this.enterRule(localContext, 298, Sql.RULE_sortSpecificationList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2722;
            this.sortSpecification();
            this.state = 2727;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 10) {
                {
                {
                this.state = 2723;
                this.match(Sql.COMMA);
                this.state = 2724;
                this.sortSpecification();
                }
                }
                this.state = 2729;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public sortSpecification(): SortSpecificationContext {
        let localContext = new SortSpecificationContext(this.context, this.state);
        this.enterRule(localContext, 300, Sql.RULE_sortSpecification);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2730;
            this.expr(0);
            this.state = 2732;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 56 || _la === 116) {
                {
                this.state = 2731;
                this.orderingSpecification();
                }
            }

            this.state = 2735;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 222) {
                {
                this.state = 2734;
                this.nullOrdering();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public orderingSpecification(): OrderingSpecificationContext {
        let localContext = new OrderingSpecificationContext(this.context, this.state);
        this.enterRule(localContext, 302, Sql.RULE_orderingSpecification);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2737;
            _la = this.tokenStream.LA(1);
            if(!(_la === 56 || _la === 116)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public nullOrdering(): NullOrderingContext {
        let localContext = new NullOrderingContext(this.context, this.state);
        this.enterRule(localContext, 304, Sql.RULE_nullOrdering);
        try {
            this.state = 2743;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 325, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2739;
                this.match(Sql.NULLS);
                this.state = 2740;
                this.match(Sql.FIRST);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2741;
                this.match(Sql.NULLS);
                this.state = 2742;
                this.match(Sql.LAST);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public returningStatement(): ReturningStatementContext {
        let localContext = new ReturningStatementContext(this.context, this.state);
        this.enterRule(localContext, 306, Sql.RULE_returningStatement);
        try {
            localContext = new DmlReturningStatementContext(localContext);
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2745;
            this.match(Sql.RETURNING);
            this.state = 2746;
            this.selectList();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public dmlStatementValidTimeExtents(): DmlStatementValidTimeExtentsContext {
        let localContext = new DmlStatementValidTimeExtentsContext(this.context, this.state);
        this.enterRule(localContext, 308, Sql.RULE_dmlStatementValidTimeExtents);
        let _la: number;
        try {
            this.state = 2767;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 329, this.context) ) {
            case 1:
                localContext = new DmlStatementValidTimePortionContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2748;
                this.match(Sql.FOR);
                this.state = 2751;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 254) {
                    {
                    this.state = 2749;
                    this.match(Sql.PORTION);
                    this.state = 2750;
                    this.match(Sql.OF);
                    }
                }

                this.state = 2753;
                this.match(Sql.VALID_TIME);
                this.state = 2754;
                this.match(Sql.FROM);
                this.state = 2755;
                (localContext as DmlStatementValidTimePortionContext)._from_ = this.staticExpr();
                this.state = 2758;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 321) {
                    {
                    this.state = 2756;
                    this.match(Sql.TO);
                    this.state = 2757;
                    (localContext as DmlStatementValidTimePortionContext)._to = this.staticExpr();
                    }
                }

                }
                break;
            case 2:
                localContext = new DmlStatementValidTimeAllContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2760;
                this.match(Sql.FOR);
                this.state = 2765;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case Sql.ALL:
                    {
                    this.state = 2761;
                    this.match(Sql.ALL);
                    this.state = 2762;
                    this.match(Sql.VALID_TIME);
                    }
                    break;
                case Sql.VALID_TIME:
                    {
                    this.state = 2763;
                    this.match(Sql.VALID_TIME);
                    this.state = 2764;
                    this.match(Sql.ALL);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public patchStatementValidTimeExtents(): PatchStatementValidTimeExtentsContext {
        let localContext = new PatchStatementValidTimeExtentsContext(this.context, this.state);
        this.enterRule(localContext, 310, Sql.RULE_patchStatementValidTimeExtents);
        let _la: number;
        try {
            localContext = new PatchStatementValidTimePortionContext(localContext);
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2769;
            this.match(Sql.FOR);
            this.state = 2772;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 254) {
                {
                this.state = 2770;
                this.match(Sql.PORTION);
                this.state = 2771;
                this.match(Sql.OF);
                }
            }

            this.state = 2774;
            this.match(Sql.VALID_TIME);
            this.state = 2775;
            this.match(Sql.FROM);
            this.state = 2776;
            (localContext as PatchStatementValidTimePortionContext)._from_ = this.staticExpr();
            this.state = 2779;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 321) {
                {
                this.state = 2777;
                this.match(Sql.TO);
                this.state = 2778;
                (localContext as PatchStatementValidTimePortionContext)._to = this.staticExpr();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public patchSource(): PatchSourceContext {
        let localContext = new PatchSourceContext(this.context, this.state);
        this.enterRule(localContext, 312, Sql.RULE_patchSource);
        try {
            localContext = new PatchRecordsContext(localContext);
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2781;
            this.recordsValueConstructor();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public insertColumnsAndSource(): InsertColumnsAndSourceContext {
        let localContext = new InsertColumnsAndSourceContext(this.context, this.state);
        this.enterRule(localContext, 314, Sql.RULE_insertColumnsAndSource);
        let _la: number;
        try {
            this.state = 2804;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 335, this.context) ) {
            case 1:
                localContext = new InsertValuesContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2787;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 15) {
                    {
                    this.state = 2783;
                    this.match(Sql.LPAREN);
                    this.state = 2784;
                    this.columnNameList();
                    this.state = 2785;
                    this.match(Sql.RPAREN);
                    }
                }

                this.state = 2789;
                this.tableValueConstructor();
                }
                break;
            case 2:
                localContext = new InsertRecordsContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2794;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 15) {
                    {
                    this.state = 2790;
                    this.match(Sql.LPAREN);
                    this.state = 2791;
                    this.columnNameList();
                    this.state = 2792;
                    this.match(Sql.RPAREN);
                    }
                }

                this.state = 2796;
                this.recordsValueConstructor();
                }
                break;
            case 3:
                localContext = new InsertFromSubqueryContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 2801;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 334, this.context) ) {
                case 1:
                    {
                    this.state = 2797;
                    this.match(Sql.LPAREN);
                    this.state = 2798;
                    this.columnNameList();
                    this.state = 2799;
                    this.match(Sql.RPAREN);
                    }
                    break;
                }
                this.state = 2803;
                this.queryExpression();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public setClauseList(): SetClauseListContext {
        let localContext = new SetClauseListContext(this.context, this.state);
        this.enterRule(localContext, 316, Sql.RULE_setClauseList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2806;
            this.setClause();
            this.state = 2811;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 10) {
                {
                {
                this.state = 2807;
                this.match(Sql.COMMA);
                this.state = 2808;
                this.setClause();
                }
                }
                this.state = 2813;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public setClause(): SetClauseContext {
        let localContext = new SetClauseContext(this.context, this.state);
        this.enterRule(localContext, 318, Sql.RULE_setClause);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2814;
            this.setTarget();
            this.state = 2815;
            this.match(Sql.EQUAL);
            this.state = 2816;
            localContext._updateSource = this.expr(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public setTarget(): SetTargetContext {
        let localContext = new SetTargetContext(this.context, this.state);
        this.enterRule(localContext, 320, Sql.RULE_setTarget);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2818;
            this.columnName();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public sessionCharacteristic(): SessionCharacteristicContext {
        let localContext = new SessionCharacteristicContext(this.context, this.state);
        this.enterRule(localContext, 322, Sql.RULE_sessionCharacteristic);
        try {
            let alternative: number;
            localContext = new SessionTxCharacteristicsContext(localContext);
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2820;
            this.match(Sql.TRANSACTION);
            this.state = 2821;
            this.sessionTxMode();
            this.state = 2826;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 337, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 2822;
                    this.match(Sql.COMMA);
                    this.state = 2823;
                    this.sessionTxMode();
                    }
                    }
                }
                this.state = 2828;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 337, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public sessionTxMode(): SessionTxModeContext {
        let localContext = new SessionTxModeContext(this.context, this.state);
        this.enterRule(localContext, 324, Sql.RULE_sessionTxMode);
        try {
            this.state = 2836;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 338, this.context) ) {
            case 1:
                localContext = new SessionIsolationLevelContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2829;
                this.match(Sql.ISOLATION);
                this.state = 2830;
                this.match(Sql.LEVEL);
                this.state = 2831;
                this.levelOfIsolation();
                }
                break;
            case 2:
                localContext = new ReadOnlySessionContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2832;
                this.match(Sql.READ);
                this.state = 2833;
                this.match(Sql.ONLY);
                }
                break;
            case 3:
                localContext = new ReadWriteSessionContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 2834;
                this.match(Sql.READ);
                this.state = 2835;
                this.match(Sql.WRITE);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public transactionCharacteristics(): TransactionCharacteristicsContext {
        let localContext = new TransactionCharacteristicsContext(this.context, this.state);
        this.enterRule(localContext, 326, Sql.RULE_transactionCharacteristics);
        let _la: number;
        try {
            this.state = 2880;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 344, this.context) ) {
            case 1:
                localContext = new ReadOnlyTxCharacteristicsContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2843;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 63 || _la === 85 || _la === 177 || ((((_la - 295)) & ~0x1F) === 0 && ((1 << (_la - 295)) & 9437187) !== 0)) {
                    {
                    {
                    this.state = 2838;
                    this.readOnlyTxMode();
                    this.state = 2839;
                    this.match(Sql.COMMA);
                    }
                    }
                    this.state = 2845;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 2846;
                this.match(Sql.READ);
                this.state = 2847;
                this.match(Sql.ONLY);
                this.state = 2852;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 10) {
                    {
                    {
                    this.state = 2848;
                    this.match(Sql.COMMA);
                    this.state = 2849;
                    this.readOnlyTxMode();
                    }
                    }
                    this.state = 2854;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                }
                break;
            case 2:
                localContext = new ReadWriteTxCharacteristicsContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2860;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 59 || _la === 177 || _la === 201 || ((((_la - 308)) & ~0x1F) === 0 && ((1 << (_la - 308)) & 1153) !== 0)) {
                    {
                    {
                    this.state = 2855;
                    this.readWriteTxMode();
                    this.state = 2856;
                    this.match(Sql.COMMA);
                    }
                    }
                    this.state = 2862;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 2863;
                this.match(Sql.READ);
                this.state = 2864;
                this.match(Sql.WRITE);
                this.state = 2869;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 10) {
                    {
                    {
                    this.state = 2865;
                    this.match(Sql.COMMA);
                    this.state = 2866;
                    this.readWriteTxMode();
                    }
                    }
                    this.state = 2871;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                }
                break;
            case 3:
                localContext = new CommonTxCharacteristicsContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 2872;
                this.commonTxMode();
                this.state = 2877;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 10) {
                    {
                    {
                    this.state = 2873;
                    this.match(Sql.COMMA);
                    this.state = 2874;
                    this.commonTxMode();
                    }
                    }
                    this.state = 2879;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public commonTxMode(): CommonTxModeContext {
        let localContext = new CommonTxModeContext(this.context, this.state);
        this.enterRule(localContext, 328, Sql.RULE_commonTxMode);
        try {
            this.state = 2886;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.ISOLATION:
                localContext = new IsolationLevelTxModeContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2882;
                this.match(Sql.ISOLATION);
                this.state = 2883;
                this.match(Sql.LEVEL);
                this.state = 2884;
                this.levelOfIsolation();
                }
                break;
            case Sql.TIME:
            case Sql.TIMEZONE:
                localContext = new TxTzModeContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2885;
                this.txTzOption();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public readOnlyTxMode(): ReadOnlyTxModeContext {
        let localContext = new ReadOnlyTxModeContext(this.context, this.state);
        this.enterRule(localContext, 330, Sql.RULE_readOnlyTxMode);
        try {
            this.state = 2890;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.ISOLATION:
            case Sql.TIME:
            case Sql.TIMEZONE:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2888;
                this.commonTxMode();
                }
                break;
            case Sql.AWAIT_TOKEN:
            case Sql.CLOCK_TIME:
            case Sql.SNAPSHOT_TIME:
            case Sql.SNAPSHOT_TOKEN:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2889;
                this.readOnlyTxOption();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public readWriteTxMode(): ReadWriteTxModeContext {
        let localContext = new ReadWriteTxModeContext(this.context, this.state);
        this.enterRule(localContext, 332, Sql.RULE_readWriteTxMode);
        try {
            this.state = 2894;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.ISOLATION:
            case Sql.TIME:
            case Sql.TIMEZONE:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2892;
                this.commonTxMode();
                }
                break;
            case Sql.ASYNC:
            case Sql.METADATA:
            case Sql.SYSTEM_TIME:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2893;
                this.readWriteTxOption();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public beginWithCharacteristics(): BeginWithCharacteristicsContext {
        let localContext = new BeginWithCharacteristicsContext(this.context, this.state);
        this.enterRule(localContext, 334, Sql.RULE_beginWithCharacteristics);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2896;
            this.beginWithMode();
            this.state = 2901;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 10) {
                {
                {
                this.state = 2897;
                this.match(Sql.COMMA);
                this.state = 2898;
                this.beginWithMode();
                }
                }
                this.state = 2903;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public beginWithMode(): BeginWithModeContext {
        let localContext = new BeginWithModeContext(this.context, this.state);
        this.enterRule(localContext, 336, Sql.RULE_beginWithMode);
        let _la: number;
        try {
            this.state = 2941;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 355, this.context) ) {
            case 1:
                localContext = new BeginWithIsolationLevelContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2904;
                this.match(Sql.ISOLATION);
                this.state = 2905;
                this.match(Sql.LEVEL);
                this.state = 2906;
                this.levelOfIsolation();
                }
                break;
            case 2:
                localContext = new BeginReadOnlyWithContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2907;
                this.match(Sql.READ);
                this.state = 2908;
                this.match(Sql.ONLY);
                this.state = 2909;
                this.match(Sql.WITH);
                this.state = 2910;
                this.match(Sql.LPAREN);
                this.state = 2912;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 63 || _la === 85 || ((((_la - 295)) & ~0x1F) === 0 && ((1 << (_la - 295)) & 9437187) !== 0)) {
                    {
                    this.state = 2911;
                    this.beginReadOnlyOption();
                    }
                }

                this.state = 2920;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 10) {
                    {
                    {
                    this.state = 2914;
                    this.match(Sql.COMMA);
                    this.state = 2916;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 63 || _la === 85 || ((((_la - 295)) & ~0x1F) === 0 && ((1 << (_la - 295)) & 9437187) !== 0)) {
                        {
                        this.state = 2915;
                        this.beginReadOnlyOption();
                        }
                    }

                    }
                    }
                    this.state = 2922;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 2923;
                this.match(Sql.RPAREN);
                }
                break;
            case 3:
                localContext = new BeginReadWriteWithContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 2924;
                this.match(Sql.READ);
                this.state = 2925;
                this.match(Sql.WRITE);
                this.state = 2926;
                this.match(Sql.WITH);
                this.state = 2927;
                this.match(Sql.LPAREN);
                this.state = 2929;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 59 || _la === 201 || ((((_la - 308)) & ~0x1F) === 0 && ((1 << (_la - 308)) & 1153) !== 0)) {
                    {
                    this.state = 2928;
                    this.beginReadWriteOption();
                    }
                }

                this.state = 2937;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 10) {
                    {
                    {
                    this.state = 2931;
                    this.match(Sql.COMMA);
                    this.state = 2933;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 59 || _la === 201 || ((((_la - 308)) & ~0x1F) === 0 && ((1 << (_la - 308)) & 1153) !== 0)) {
                        {
                        this.state = 2932;
                        this.beginReadWriteOption();
                        }
                    }

                    }
                    }
                    this.state = 2939;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 2940;
                this.match(Sql.RPAREN);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public beginReadOnlyOption(): BeginReadOnlyOptionContext {
        let localContext = new BeginReadOnlyOptionContext(this.context, this.state);
        this.enterRule(localContext, 338, Sql.RULE_beginReadOnlyOption);
        try {
            this.state = 2945;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.AWAIT_TOKEN:
            case Sql.CLOCK_TIME:
            case Sql.SNAPSHOT_TIME:
            case Sql.SNAPSHOT_TOKEN:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2943;
                this.readOnlyTxOption();
                }
                break;
            case Sql.TIME:
            case Sql.TIMEZONE:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2944;
                this.txTzOption();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public beginReadWriteOption(): BeginReadWriteOptionContext {
        let localContext = new BeginReadWriteOptionContext(this.context, this.state);
        this.enterRule(localContext, 340, Sql.RULE_beginReadWriteOption);
        try {
            this.state = 2949;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.ASYNC:
            case Sql.METADATA:
            case Sql.SYSTEM_TIME:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2947;
                this.readWriteTxOption();
                }
                break;
            case Sql.TIME:
            case Sql.TIMEZONE:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2948;
                this.txTzOption();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public txOptionValue(): TxOptionValueContext {
        let localContext = new TxOptionValueContext(this.context, this.state);
        this.enterRule(localContext, 342, Sql.RULE_txOptionValue);
        try {
            this.state = 2953;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.UNSIGNED_FLOAT:
            case Sql.UNSIGNED_INTEGER:
            case Sql.CHARACTER_STRING:
            case Sql.C_ESCAPES_STRING:
            case Sql.BINARY_STRING:
            case Sql.POSTGRES_PARAMETER_SPECIFICATION:
            case Sql.QUESTION:
            case Sql.LPAREN:
            case Sql.LBRACK:
            case Sql.LBRACE:
            case Sql.TILDE:
            case Sql.PLUS:
            case Sql.MINUS:
            case Sql.ARRAY:
            case Sql.ARRAY_AGG:
            case Sql.AT:
            case Sql.ATTACH:
            case Sql.AVG:
            case Sql.BETWEEN:
            case Sql.BIGINT:
            case Sql.BOOL:
            case Sql.BOOLEAN:
            case Sql.BOOL_AND:
            case Sql.BOOL_OR:
            case Sql.BPCHAR:
            case Sql.BY:
            case Sql.BYTEA:
            case Sql.CASE:
            case Sql.CAST:
            case Sql.CHAR:
            case Sql.CHARACTER_LENGTH:
            case Sql.CHAR_LENGTH:
            case Sql.COALESCE:
            case Sql.COMMITTED:
            case Sql.COPY:
            case Sql.COUNT:
            case Sql.CUME_DIST:
            case Sql.CURRENT:
            case Sql.CURRENT_CATALOG:
            case Sql.CURRENT_DATE:
            case Sql.CURRENT_SCHEMA:
            case Sql.CURRENT_SCHEMAS:
            case Sql.CURRENT_SETTING:
            case Sql.CURRENT_TIME:
            case Sql.CURRENT_TIMESTAMP:
            case Sql.CURRENT_USER:
            case Sql.DATABASE:
            case Sql.DATE:
            case Sql.DATE_BIN:
            case Sql.DATE_TRUNC:
            case Sql.DAY:
            case Sql.DEC:
            case Sql.DECIMAL:
            case Sql.DELETE:
            case Sql.DENSE_RANK:
            case Sql.DETACH:
            case Sql.DISCARD:
            case Sql.DOUBLE:
            case Sql.DOW:
            case Sql.DOY:
            case Sql.DURATION:
            case Sql.END:
            case Sql.EPOCH:
            case Sql.ERASE:
            case Sql.EVERY:
            case Sql.EXISTS:
            case Sql.EXTRACT:
            case Sql.FALSE:
            case Sql.FILTER:
            case Sql.FIRST:
            case Sql.FIRST_VALUE:
            case Sql.FLOAT:
            case Sql.FLOAT4:
            case Sql.FLOAT8:
            case Sql.FORMAT:
            case Sql.GENERATE_SERIES:
            case Sql.HAS_ANY_COLUMN_PRIVILEGE:
            case Sql.HAS_SCHEMA_PRIVILEGE:
            case Sql.HAS_TABLE_PRIVILEGE:
            case Sql.HOUR:
            case Sql.INSERT:
            case Sql.INT:
            case Sql.INT2:
            case Sql.INT4:
            case Sql.INT8:
            case Sql.INTEGER:
            case Sql.INTERVAL:
            case Sql.ISODOW:
            case Sql.KEYWORD:
            case Sql.LAG:
            case Sql.LAST:
            case Sql.LAST_VALUE:
            case Sql.LEAD:
            case Sql.LEVEL:
            case Sql.LOCAL_DATE:
            case Sql.LOCAL_TIME:
            case Sql.LOCAL_TIMESTAMP:
            case Sql.MAX:
            case Sql.METADATA:
            case Sql.MIN:
            case Sql.MINUTE:
            case Sql.MONTH:
            case Sql.NAME:
            case Sql.NEST_MANY:
            case Sql.NEST_ONE:
            case Sql.NEXT:
            case Sql.NOT:
            case Sql.NOW:
            case Sql.NTH_VALUE:
            case Sql.NTILE:
            case Sql.NULL:
            case Sql.NULLIF:
            case Sql.NUMERIC:
            case Sql.OBJECT:
            case Sql.OF:
            case Sql.OFF:
            case Sql.OID:
            case Sql.ON:
            case Sql.OVERLAPS:
            case Sql.OVERLAY:
            case Sql.PASSWORD:
            case Sql.PERCENT_RANK:
            case Sql.PERIOD:
            case Sql.PG_EXPANDARRAY:
            case Sql.PG_GET_EXPR:
            case Sql.PG_GET_INDEXDEF:
            case Sql.PG_GET_USERBYID:
            case Sql.PG_SLEEP:
            case Sql.PG_SLEEP_FOR:
            case Sql.PG_TABLE_IS_VISIBLE:
            case Sql.PLANS:
            case Sql.POSITION:
            case Sql.PERCENTILE_CONT:
            case Sql.PERCENTILE_DISC:
            case Sql.PRECISION:
            case Sql.QUARTER:
            case Sql.RANGE:
            case Sql.RANGE_BINS:
            case Sql.RANK:
            case Sql.REAL:
            case Sql.RECORD:
            case Sql.REGCLASS:
            case Sql.REGEXP_REPLACE:
            case Sql.REGPROC:
            case Sql.REPLACE:
            case Sql.ROLE:
            case Sql.ROW:
            case Sql.ROW_NUMBER:
            case Sql.SECOND:
            case Sql.SELECT:
            case Sql.SEQUENCES:
            case Sql.SETTING:
            case Sql.SMALLINT:
            case Sql.SNAPSHOT_TOKEN:
            case Sql.START:
            case Sql.STDDEV_POP:
            case Sql.STDDEV_SAMP:
            case Sql.SUBSTRING:
            case Sql.SUM:
            case Sql.SYNC:
            case Sql.SYSTEM_TIME:
            case Sql.TABLE:
            case Sql.TEMP:
            case Sql.TEMPORARY:
            case Sql.TEXT:
            case Sql.TIME:
            case Sql.TIMESTAMP:
            case Sql.TIMESTAMPTZ:
            case Sql.TIMEZONE:
            case Sql.TRIM:
            case Sql.TRIM_ARRAY:
            case Sql.TRUE:
            case Sql.TSTZRANGE:
            case Sql.UNCOMMITTED:
            case Sql.UPDATE:
            case Sql.URI:
            case Sql.URI_FRAGMENT:
            case Sql.URI_HOST:
            case Sql.URI_PATH:
            case Sql.URI_PORT:
            case Sql.URI_QUERY:
            case Sql.URI_SCHEME:
            case Sql.URI_USER_INFO:
            case Sql.USER:
            case Sql.UUID:
            case Sql.VALID_TIME:
            case Sql.VALUE_OF:
            case Sql.VARCHAR:
            case Sql.VAR_POP:
            case Sql.VAR_SAMP:
            case Sql.VARBINARY:
            case Sql.VERSION:
            case Sql.WEEK:
            case Sql.YEAR:
            case Sql.DOLLAR_TAG:
            case Sql.REGULAR_IDENTIFIER:
            case Sql.DELIMITED_IDENTIFIER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2951;
                this.expr(0);
                }
                break;
            case Sql.DEFAULT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2952;
                this.match(Sql.DEFAULT);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public txTzOption(): TxTzOptionContext {
        let localContext = new TxTzOptionContext(this.context, this.state);
        this.enterRule(localContext, 344, Sql.RULE_txTzOption);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 2958;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.TIMEZONE:
                {
                this.state = 2955;
                this.match(Sql.TIMEZONE);
                }
                break;
            case Sql.TIME:
                {
                this.state = 2956;
                this.match(Sql.TIME);
                this.state = 2957;
                this.match(Sql.ZONE);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.state = 2961;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 37) {
                {
                this.state = 2960;
                this.match(Sql.EQUAL);
                }
            }

            this.state = 2963;
            this.txOptionValue();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public readOnlyTxOption(): ReadOnlyTxOptionContext {
        let localContext = new ReadOnlyTxOptionContext(this.context, this.state);
        this.enterRule(localContext, 346, Sql.RULE_readOnlyTxOption);
        let _la: number;
        try {
            this.state = 2985;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.SNAPSHOT_TOKEN:
                localContext = new SnapshotTokenTxOptionContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2965;
                this.match(Sql.SNAPSHOT_TOKEN);
                this.state = 2967;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 37) {
                    {
                    this.state = 2966;
                    this.match(Sql.EQUAL);
                    }
                }

                this.state = 2969;
                this.txOptionValue();
                }
                break;
            case Sql.SNAPSHOT_TIME:
                localContext = new SnapshotTimeTxOptionContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2970;
                this.match(Sql.SNAPSHOT_TIME);
                this.state = 2972;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 37) {
                    {
                    this.state = 2971;
                    this.match(Sql.EQUAL);
                    }
                }

                this.state = 2974;
                this.txOptionValue();
                }
                break;
            case Sql.CLOCK_TIME:
                localContext = new ClockTimeTxOptionContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 2975;
                this.match(Sql.CLOCK_TIME);
                this.state = 2977;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 37) {
                    {
                    this.state = 2976;
                    this.match(Sql.EQUAL);
                    }
                }

                this.state = 2979;
                this.txOptionValue();
                }
                break;
            case Sql.AWAIT_TOKEN:
                localContext = new AwaitTokenTxOptionContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 2980;
                this.match(Sql.AWAIT_TOKEN);
                this.state = 2982;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 37) {
                    {
                    this.state = 2981;
                    this.match(Sql.EQUAL);
                    }
                }

                this.state = 2984;
                this.txOptionValue();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public readWriteTxOption(): ReadWriteTxOptionContext {
        let localContext = new ReadWriteTxOptionContext(this.context, this.state);
        this.enterRule(localContext, 348, Sql.RULE_readWriteTxOption);
        let _la: number;
        try {
            this.state = 3005;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case Sql.SYSTEM_TIME:
                localContext = new SystemTimeTxOptionContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 2987;
                this.match(Sql.SYSTEM_TIME);
                this.state = 2989;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 37) {
                    {
                    this.state = 2988;
                    this.match(Sql.EQUAL);
                    }
                }

                this.state = 2991;
                this.txOptionValue();
                }
                break;
            case Sql.ASYNC:
                localContext = new AsyncTxOptionContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 2992;
                this.match(Sql.ASYNC);
                this.state = 2994;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 37) {
                    {
                    this.state = 2993;
                    this.match(Sql.EQUAL);
                    }
                }

                this.state = 2998;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case Sql.UNSIGNED_FLOAT:
                case Sql.UNSIGNED_INTEGER:
                case Sql.CHARACTER_STRING:
                case Sql.C_ESCAPES_STRING:
                case Sql.BINARY_STRING:
                case Sql.PLUS:
                case Sql.MINUS:
                case Sql.DATE:
                case Sql.DURATION:
                case Sql.FALSE:
                case Sql.INTERVAL:
                case Sql.KEYWORD:
                case Sql.NULL:
                case Sql.OFF:
                case Sql.ON:
                case Sql.TIME:
                case Sql.TIMESTAMP:
                case Sql.TRUE:
                case Sql.URI:
                case Sql.UUID:
                case Sql.DOLLAR_TAG:
                    {
                    this.state = 2996;
                    (localContext as AsyncTxOptionContext)._async = this.literal();
                    }
                    break;
                case Sql.DEFAULT:
                    {
                    this.state = 2997;
                    this.match(Sql.DEFAULT);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                break;
            case Sql.METADATA:
                localContext = new MetadataTxOptionContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 3000;
                this.match(Sql.METADATA);
                this.state = 3002;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 37) {
                    {
                    this.state = 3001;
                    this.match(Sql.EQUAL);
                    }
                }

                this.state = 3004;
                this.txOptionValue();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public levelOfIsolation(): LevelOfIsolationContext {
        let localContext = new LevelOfIsolationContext(this.context, this.state);
        this.enterRule(localContext, 350, Sql.RULE_levelOfIsolation);
        try {
            this.state = 3014;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 371, this.context) ) {
            case 1:
                localContext = new ReadUncommittedIsolationContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 3007;
                this.match(Sql.READ);
                this.state = 3008;
                this.match(Sql.UNCOMMITTED);
                }
                break;
            case 2:
                localContext = new ReadCommittedIsolationContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 3009;
                this.match(Sql.READ);
                this.state = 3010;
                this.match(Sql.COMMITTED);
                }
                break;
            case 3:
                localContext = new RepeatableReadIsolationContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 3011;
                this.match(Sql.REPEATABLE);
                this.state = 3012;
                this.match(Sql.READ);
                }
                break;
            case 4:
                localContext = new SerializableIsolationContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 3013;
                this.match(Sql.SERIALIZABLE);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public override sempred(localContext: antlr.ParserRuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 26:
            return this.dataType_sempred(localContext as DataTypeContext, predIndex);
        case 33:
            return this.expr_sempred(localContext as ExprContext, predIndex);
        case 34:
            return this.commonValueExpr_sempred(localContext as CommonValueExprContext, predIndex);
        case 76:
            return this.tableReference_sempred(localContext as TableReferenceContext, predIndex);
        case 126:
            return this.queryExpressionBody_sempred(localContext as QueryExpressionBodyContext, predIndex);
        }
        return true;
    }
    private dataType_sempred(localContext: DataTypeContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 2);
        case 1:
            return this.precpred(this.context, 1);
        }
        return true;
    }
    private expr_sempred(localContext: ExprContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 2:
            return this.precpred(this.context, 26);
        case 3:
            return this.precpred(this.context, 25);
        case 4:
            return this.precpred(this.context, 24);
        case 5:
            return this.precpred(this.context, 23);
        case 6:
            return this.precpred(this.context, 22);
        case 7:
            return this.precpred(this.context, 21);
        case 8:
            return this.precpred(this.context, 20);
        case 9:
            return this.precpred(this.context, 19);
        case 10:
            return this.precpred(this.context, 18);
        case 11:
            return this.precpred(this.context, 17);
        case 12:
            return this.precpred(this.context, 16);
        case 13:
            return this.precpred(this.context, 15);
        case 14:
            return this.precpred(this.context, 14);
        case 15:
            return this.precpred(this.context, 13);
        case 16:
            return this.precpred(this.context, 12);
        case 17:
            return this.precpred(this.context, 11);
        case 18:
            return this.precpred(this.context, 10);
        case 19:
            return this.precpred(this.context, 9);
        case 20:
            return this.precpred(this.context, 5);
        case 21:
            return this.precpred(this.context, 3);
        case 22:
            return this.precpred(this.context, 2);
        case 23:
            return this.precpred(this.context, 30);
        case 24:
            return this.precpred(this.context, 29);
        case 25:
            return this.precpred(this.context, 28);
        case 26:
            return this.precpred(this.context, 27);
        case 27:
            return this.precpred(this.context, 8);
        case 28:
            return this.precpred(this.context, 7);
        case 29:
            return this.precpred(this.context, 6);
        }
        return true;
    }
    private commonValueExpr_sempred(localContext: CommonValueExprContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 30:
            return this.precpred(this.context, 64);
        case 31:
            return this.precpred(this.context, 61);
        case 32:
            return this.precpred(this.context, 60);
        case 33:
            return this.precpred(this.context, 58);
        case 34:
            return this.precpred(this.context, 67);
        case 35:
            return this.precpred(this.context, 66);
        case 36:
            return this.precpred(this.context, 65);
        }
        return true;
    }
    private tableReference_sempred(localContext: TableReferenceContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 37:
            return this.precpred(this.context, 8);
        case 38:
            return this.precpred(this.context, 7);
        case 39:
            return this.precpred(this.context, 9);
        }
        return true;
    }
    private queryExpressionBody_sempred(localContext: QueryExpressionBodyContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 40:
            return this.precpred(this.context, 2);
        case 41:
            return this.precpred(this.context, 1);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,368,3017,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,
        7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,
        13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,
        20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,
        26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,32,2,
        33,7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,2,39,7,
        39,2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,2,
        46,7,46,2,47,7,47,2,48,7,48,2,49,7,49,2,50,7,50,2,51,7,51,2,52,7,
        52,2,53,7,53,2,54,7,54,2,55,7,55,2,56,7,56,2,57,7,57,2,58,7,58,2,
        59,7,59,2,60,7,60,2,61,7,61,2,62,7,62,2,63,7,63,2,64,7,64,2,65,7,
        65,2,66,7,66,2,67,7,67,2,68,7,68,2,69,7,69,2,70,7,70,2,71,7,71,2,
        72,7,72,2,73,7,73,2,74,7,74,2,75,7,75,2,76,7,76,2,77,7,77,2,78,7,
        78,2,79,7,79,2,80,7,80,2,81,7,81,2,82,7,82,2,83,7,83,2,84,7,84,2,
        85,7,85,2,86,7,86,2,87,7,87,2,88,7,88,2,89,7,89,2,90,7,90,2,91,7,
        91,2,92,7,92,2,93,7,93,2,94,7,94,2,95,7,95,2,96,7,96,2,97,7,97,2,
        98,7,98,2,99,7,99,2,100,7,100,2,101,7,101,2,102,7,102,2,103,7,103,
        2,104,7,104,2,105,7,105,2,106,7,106,2,107,7,107,2,108,7,108,2,109,
        7,109,2,110,7,110,2,111,7,111,2,112,7,112,2,113,7,113,2,114,7,114,
        2,115,7,115,2,116,7,116,2,117,7,117,2,118,7,118,2,119,7,119,2,120,
        7,120,2,121,7,121,2,122,7,122,2,123,7,123,2,124,7,124,2,125,7,125,
        2,126,7,126,2,127,7,127,2,128,7,128,2,129,7,129,2,130,7,130,2,131,
        7,131,2,132,7,132,2,133,7,133,2,134,7,134,2,135,7,135,2,136,7,136,
        2,137,7,137,2,138,7,138,2,139,7,139,2,140,7,140,2,141,7,141,2,142,
        7,142,2,143,7,143,2,144,7,144,2,145,7,145,2,146,7,146,2,147,7,147,
        2,148,7,148,2,149,7,149,2,150,7,150,2,151,7,151,2,152,7,152,2,153,
        7,153,2,154,7,154,2,155,7,155,2,156,7,156,2,157,7,157,2,158,7,158,
        2,159,7,159,2,160,7,160,2,161,7,161,2,162,7,162,2,163,7,163,2,164,
        7,164,2,165,7,165,2,166,7,166,2,167,7,167,2,168,7,168,2,169,7,169,
        2,170,7,170,2,171,7,171,2,172,7,172,2,173,7,173,2,174,7,174,2,175,
        7,175,1,0,1,0,3,0,355,8,0,1,0,1,0,1,1,1,1,1,1,5,1,362,8,1,10,1,12,
        1,365,9,1,1,1,3,1,368,8,1,1,1,1,1,1,2,1,2,3,2,374,8,2,3,2,376,8,
        2,1,2,3,2,379,8,2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,387,8,2,1,2,1,2,1,
        2,3,2,392,8,2,1,2,3,2,395,8,2,1,2,3,2,398,8,2,1,2,1,2,1,2,1,2,3,
        2,404,8,2,1,2,3,2,407,8,2,1,2,1,2,1,2,1,2,3,2,413,8,2,1,2,3,2,416,
        8,2,1,2,3,2,419,8,2,1,2,1,2,3,2,423,8,2,1,2,3,2,426,8,2,1,2,1,2,
        1,2,1,2,3,2,432,8,2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,440,8,2,1,2,3,2,
        443,8,2,1,2,1,2,3,2,447,8,2,1,2,1,2,1,2,1,2,3,2,453,8,2,1,2,1,2,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,
        1,2,3,2,474,8,2,3,2,476,8,2,1,2,1,2,3,2,480,8,2,1,2,1,2,1,2,1,2,
        1,2,3,2,487,8,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,5,2,497,8,2,10,2,
        12,2,500,9,2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,508,8,2,1,2,1,2,3,2,512,
        8,2,1,2,1,2,1,2,3,2,517,8,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,526,
        8,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,
        1,2,1,2,1,2,1,2,3,2,547,8,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,565,8,2,1,2,1,2,1,2,1,2,1,2,1,2,
        3,2,573,8,2,3,2,575,8,2,1,3,1,3,1,3,1,3,3,3,581,8,3,1,4,1,4,1,4,
        3,4,586,8,4,1,4,1,4,1,5,1,5,1,5,1,5,5,5,594,8,5,10,5,12,5,597,9,
        5,1,5,1,5,3,5,601,8,5,1,6,1,6,1,6,3,6,606,8,6,1,6,1,6,3,6,610,8,
        6,5,6,612,8,6,10,6,12,6,615,9,6,1,6,1,6,1,7,1,7,3,7,621,8,7,1,7,
        1,7,1,8,1,8,1,8,1,8,1,8,1,8,3,8,631,8,8,3,8,633,8,8,1,9,1,9,1,9,
        1,9,5,9,639,8,9,10,9,12,9,642,9,9,1,10,1,10,1,10,3,10,647,8,10,1,
        10,1,10,1,10,1,10,3,10,653,8,10,1,10,1,10,1,10,1,10,1,10,1,10,1,
        10,1,10,1,10,1,10,3,10,665,8,10,1,11,1,11,3,11,669,8,11,1,11,1,11,
        3,11,673,8,11,1,12,1,12,1,12,1,12,3,12,679,8,12,1,12,3,12,682,8,
        12,1,13,3,13,685,8,13,1,13,1,13,1,14,3,14,690,8,14,1,14,1,14,1,14,
        1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,
        1,14,1,14,3,14,710,8,14,1,15,4,15,713,8,15,11,15,12,15,714,1,16,
        1,16,1,16,1,16,3,16,721,8,16,1,16,3,16,724,8,16,1,17,1,17,1,17,1,
        17,1,17,3,17,731,8,17,1,18,1,18,1,19,1,19,1,20,1,20,1,20,1,20,1,
        20,1,20,3,20,743,8,20,3,20,745,8,20,1,21,1,21,1,21,5,21,750,8,21,
        10,21,12,21,753,9,21,1,22,1,22,3,22,757,8,22,1,22,3,22,760,8,22,
        1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,
        1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,
        1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,
        1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,
        1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,
        1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,
        1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,3,23,849,8,23,1,24,
        1,24,1,25,1,25,3,25,855,8,25,1,26,1,26,1,26,1,26,1,26,1,26,3,26,
        863,8,26,1,26,1,26,3,26,867,8,26,1,26,1,26,1,26,1,26,1,26,1,26,3,
        26,875,8,26,1,26,1,26,1,26,3,26,880,8,26,1,26,3,26,883,8,26,1,26,
        1,26,1,26,1,26,1,26,1,26,1,26,3,26,892,8,26,1,26,3,26,895,8,26,1,
        26,1,26,1,26,1,26,1,26,3,26,902,8,26,1,26,3,26,905,8,26,1,26,1,26,
        1,26,3,26,910,8,26,1,26,1,26,1,26,1,26,1,26,1,26,3,26,918,8,26,1,
        26,1,26,1,26,1,26,1,26,5,26,925,8,26,10,26,12,26,928,9,26,1,26,1,
        26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,3,26,940,8,26,1,26,1,
        26,1,26,1,26,1,26,1,26,3,26,948,8,26,1,26,1,26,1,26,3,26,953,8,26,
        1,26,5,26,956,8,26,10,26,12,26,959,9,26,1,27,1,27,1,28,1,28,1,29,
        1,29,1,30,1,30,1,30,1,30,3,30,971,8,30,1,30,1,30,1,30,1,30,3,30,
        977,8,30,3,30,979,8,30,1,31,1,31,1,32,1,32,1,32,1,33,1,33,1,33,3,
        33,989,8,33,1,33,1,33,3,33,993,8,33,1,33,1,33,1,33,1,33,1,33,1,33,
        1,33,3,33,1002,8,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,
        1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,
        1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,
        1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,
        1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,
        1,33,1,33,1,33,1,33,1,33,1,33,1,33,3,33,1072,8,33,1,33,1,33,1,33,
        1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,3,33,1085,8,33,1,33,1,33,
        1,33,1,33,3,33,1091,8,33,1,33,1,33,1,33,1,33,3,33,1097,8,33,1,33,
        1,33,3,33,1101,8,33,1,33,1,33,1,33,1,33,3,33,1107,8,33,1,33,1,33,
        1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,3,33,1121,8,33,
        1,33,1,33,1,33,1,33,3,33,1127,8,33,1,33,5,33,1130,8,33,10,33,12,
        33,1133,9,33,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,
        34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,
        34,1,34,1,34,1,34,1,34,4,34,1163,8,34,11,34,12,34,1164,1,34,3,34,
        1168,8,34,1,34,1,34,1,34,1,34,4,34,1174,8,34,11,34,12,34,1175,1,
        34,3,34,1179,8,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,
        34,1,34,1,34,1,34,1,34,5,34,1195,8,34,10,34,12,34,1198,9,34,1,34,
        1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,1,34,3,34,1217,8,34,1,34,1,34,1,34,1,34,1,34,3,34,1224,
        8,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,3,34,1234,8,34,1,34,
        1,34,1,34,1,34,1,34,3,34,1241,8,34,1,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,3,34,1251,8,34,1,34,1,34,1,34,1,34,1,34,3,34,1258,8,34,
        1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,3,34,1268,8,34,1,34,1,34,
        1,34,1,34,1,34,1,34,3,34,1276,8,34,1,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,3,34,1286,8,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,1,34,1,34,3,34,1300,8,34,1,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,3,34,1316,8,34,1,34,1,34,
        1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,3,34,1330,8,34,
        1,34,1,34,1,34,1,34,1,34,5,34,1337,8,34,10,34,12,34,1340,9,34,3,
        34,1342,8,34,1,34,1,34,1,34,1,34,1,34,1,34,3,34,1350,8,34,1,34,1,
        34,3,34,1354,8,34,1,34,3,34,1357,8,34,1,34,1,34,3,34,1361,8,34,1,
        34,1,34,1,34,1,34,3,34,1367,8,34,3,34,1369,8,34,1,34,1,34,1,34,1,
        34,1,34,3,34,1376,8,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,3,34,1385,
        8,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,3,34,1433,8,34,1,34,1,34,
        3,34,1437,8,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,3,34,
        1461,8,34,3,34,1463,8,34,1,34,1,34,3,34,1467,8,34,1,34,1,34,1,34,
        1,34,1,34,3,34,1474,8,34,1,34,1,34,1,34,1,34,3,34,1480,8,34,1,34,
        1,34,1,34,3,34,1485,8,34,1,34,1,34,1,34,3,34,1490,8,34,1,34,1,34,
        1,34,1,34,1,34,1,34,1,34,1,34,3,34,1500,8,34,1,34,1,34,1,34,3,34,
        1505,8,34,1,34,1,34,1,34,3,34,1510,8,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,3,34,1519,8,34,1,34,1,34,3,34,1523,8,34,1,34,1,34,1,34,
        3,34,1528,8,34,1,34,1,34,1,34,1,34,1,34,3,34,1535,8,34,1,34,1,34,
        1,34,3,34,1540,8,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,3,34,
        1550,8,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,3,34,
        1575,8,34,1,34,1,34,1,34,1,34,1,34,3,34,1582,8,34,1,34,1,34,1,34,
        1,34,1,34,1,34,1,34,3,34,1591,8,34,1,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,1,34,3,34,1602,8,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,3,34,1613,8,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,4,34,
        1622,8,34,11,34,12,34,1623,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,
        34,1,34,3,34,1635,8,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,
        34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,
        34,1,34,5,34,1660,8,34,10,34,12,34,1663,9,34,1,35,1,35,1,35,3,35,
        1668,8,35,1,35,1,35,1,35,3,35,1673,8,35,1,35,3,35,1676,8,35,1,35,
        1,35,1,35,3,35,1681,8,35,1,35,1,35,1,35,3,35,1686,8,35,1,35,1,35,
        1,35,1,35,1,35,3,35,1693,8,35,3,35,1695,8,35,1,36,1,36,1,37,1,37,
        1,37,1,37,1,37,5,37,1704,8,37,10,37,12,37,1707,9,37,3,37,1709,8,
        37,1,37,1,37,1,37,1,37,1,37,5,37,1716,8,37,10,37,12,37,1719,9,37,
        3,37,1721,8,37,1,37,3,37,1724,8,37,1,38,1,38,1,38,1,38,1,39,1,39,
        3,39,1732,8,39,1,40,1,40,3,40,1736,8,40,1,41,1,41,1,42,1,42,1,42,
        3,42,1743,8,42,1,42,1,42,1,42,1,42,1,42,1,42,1,42,3,42,1752,8,42,
        1,42,1,42,1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,
        1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,3,43,1776,8,43,3,43,
        1778,8,43,1,43,1,43,3,43,1782,8,43,1,43,1,43,1,43,1,43,1,43,3,43,
        1789,8,43,1,43,1,43,1,43,1,43,1,43,1,43,1,43,3,43,1798,8,43,1,43,
        3,43,1801,8,43,3,43,1803,8,43,1,44,1,44,1,45,1,45,3,45,1809,8,45,
        1,46,1,46,1,46,1,46,3,46,1815,8,46,1,47,1,47,1,48,1,48,1,49,1,49,
        1,49,1,49,3,49,1825,8,49,1,50,1,50,3,50,1829,8,50,1,51,1,51,1,51,
        1,51,1,51,1,51,1,51,1,51,1,51,1,51,1,51,1,51,3,51,1843,8,51,1,51,
        1,51,3,51,1847,8,51,1,52,1,52,1,53,1,53,3,53,1853,8,53,1,54,1,54,
        1,54,1,54,3,54,1859,8,54,1,55,1,55,1,56,1,56,1,57,1,57,1,57,1,57,
        1,57,1,58,1,58,1,58,1,58,1,58,1,59,1,59,1,59,1,60,1,60,1,60,5,60,
        1881,8,60,10,60,12,60,1884,9,60,1,61,1,61,3,61,1888,8,61,1,62,1,
        62,1,62,3,62,1893,8,62,1,63,1,63,3,63,1897,8,63,1,64,1,64,1,65,1,
        65,1,66,1,66,1,67,1,67,1,67,1,67,1,67,1,67,1,67,1,67,1,67,1,67,1,
        67,1,67,1,67,1,67,1,67,3,67,1920,8,67,1,68,3,68,1923,8,68,1,68,1,
        68,1,68,1,68,5,68,1929,8,68,10,68,12,68,1932,9,68,3,68,1934,8,68,
        1,68,1,68,1,68,3,68,1939,8,68,1,69,1,69,1,69,1,69,1,69,5,69,1946,
        8,69,10,69,12,69,1949,9,69,3,69,1951,8,69,1,69,1,69,1,69,1,69,1,
        69,1,69,4,69,1959,8,69,11,69,12,69,1960,3,69,1963,8,69,1,69,3,69,
        1966,8,69,1,70,1,70,1,70,5,70,1971,8,70,10,70,12,70,1974,9,70,1,
        71,1,71,1,71,1,72,1,72,3,72,1981,8,72,1,73,1,73,1,73,5,73,1986,8,
        73,10,73,12,73,1989,9,73,1,74,1,74,1,74,1,75,1,75,1,75,1,75,5,75,
        1998,8,75,10,75,12,75,2001,9,75,1,76,1,76,1,76,1,76,5,76,2007,8,
        76,10,76,12,76,2010,9,76,1,76,1,76,3,76,2014,8,76,3,76,2016,8,76,
        1,76,1,76,1,76,3,76,2021,8,76,1,76,1,76,1,76,1,76,3,76,2027,8,76,
        1,76,1,76,1,76,1,76,1,76,3,76,2034,8,76,1,76,1,76,3,76,2038,8,76,
        1,76,1,76,3,76,2042,8,76,1,76,1,76,3,76,2046,8,76,1,76,1,76,3,76,
        2050,8,76,1,76,1,76,3,76,2054,8,76,3,76,2056,8,76,1,76,1,76,1,76,
        1,76,3,76,2062,8,76,1,76,1,76,1,76,1,76,1,76,1,76,1,76,3,76,2071,
        8,76,1,76,1,76,1,76,1,76,3,76,2077,8,76,1,76,1,76,1,76,1,76,5,76,
        2083,8,76,10,76,12,76,2086,9,76,1,77,1,77,1,77,1,78,3,78,2092,8,
        78,1,78,1,78,1,79,1,79,1,79,1,79,1,80,1,80,1,80,1,80,1,80,1,80,3,
        80,2106,8,80,1,81,1,81,1,81,1,81,1,81,1,81,1,81,1,81,1,81,1,81,1,
        81,1,81,1,81,1,81,3,81,2122,8,81,1,82,1,82,1,82,1,82,1,82,1,82,1,
        82,1,82,1,82,1,82,1,82,1,82,1,82,1,82,3,82,2138,8,82,1,83,1,83,1,
        83,3,83,2143,8,83,1,83,1,83,1,83,3,83,2148,8,83,1,83,1,83,1,84,1,
        84,1,84,5,84,2155,8,84,10,84,12,84,2158,9,84,1,85,1,85,1,85,1,85,
        1,85,1,85,1,85,3,85,2167,8,85,1,86,1,86,1,86,3,86,2172,8,86,3,86,
        2174,8,86,1,87,1,87,1,88,1,88,1,88,1,89,1,89,1,89,3,89,2184,8,89,
        1,89,1,89,1,89,5,89,2189,8,89,10,89,12,89,2192,9,89,1,90,1,90,1,
        90,3,90,2197,8,90,1,91,1,91,1,91,1,92,1,92,1,92,1,93,1,93,1,93,5,
        93,2208,8,93,10,93,12,93,2211,9,93,1,94,1,94,1,94,1,94,1,95,1,95,
        1,96,1,96,1,96,1,96,1,97,3,97,2224,8,97,1,97,3,97,2227,8,97,1,97,
        3,97,2230,8,97,1,97,3,97,2233,8,97,1,98,1,98,1,98,1,98,1,99,1,99,
        1,99,5,99,2242,8,99,10,99,12,99,2245,9,99,1,100,1,100,1,100,1,100,
        1,101,1,101,1,101,3,101,2254,8,101,1,102,1,102,1,103,1,103,3,103,
        2260,8,103,1,104,1,104,1,104,1,104,1,104,3,104,2267,8,104,1,105,
        1,105,1,105,1,106,1,106,1,106,1,106,1,106,1,107,1,107,1,107,1,107,
        3,107,2281,8,107,1,108,1,108,1,108,1,109,1,109,1,109,1,109,1,109,
        1,109,1,109,1,109,1,109,1,109,3,109,2296,8,109,1,110,1,110,3,110,
        2300,8,110,1,110,1,110,1,111,1,111,1,111,3,111,2307,8,111,5,111,
        2309,8,111,10,111,12,111,2312,9,111,1,111,3,111,2315,8,111,1,111,
        1,111,3,111,2319,8,111,5,111,2321,8,111,10,111,12,111,2324,9,111,
        1,111,1,111,3,111,2328,8,111,3,111,2330,8,111,1,112,1,112,3,112,
        2334,8,112,1,112,3,112,2337,8,112,1,113,1,113,3,113,2341,8,113,1,
        114,1,114,1,114,1,114,3,114,2347,8,114,1,114,3,114,2350,8,114,1,
        115,1,115,1,115,1,115,1,115,1,115,1,115,5,115,2359,8,115,10,115,
        12,115,2362,9,115,1,115,1,115,3,115,2366,8,115,1,116,1,116,1,116,
        1,117,1,117,1,117,1,117,1,117,1,117,1,117,5,117,2378,8,117,10,117,
        12,117,2381,9,117,1,117,1,117,3,117,2385,8,117,1,118,1,118,1,118,
        1,119,1,119,1,119,1,119,1,119,1,119,1,119,5,119,2397,8,119,10,119,
        12,119,2400,9,119,1,119,1,119,3,119,2404,8,119,1,120,1,120,3,120,
        2408,8,120,1,121,1,121,1,121,3,121,2413,8,121,1,121,3,121,2416,8,
        121,1,122,3,122,2419,8,122,1,122,1,122,1,123,1,123,3,123,2425,8,
        123,1,123,3,123,2428,8,123,1,124,1,124,3,124,2432,8,124,1,124,1,
        124,1,124,5,124,2437,8,124,10,124,12,124,2440,9,124,1,125,3,125,
        2443,8,125,1,125,1,125,1,125,1,125,1,125,3,125,2450,8,125,1,125,
        1,125,1,125,1,126,1,126,1,126,3,126,2458,8,126,1,126,3,126,2461,
        8,126,1,126,3,126,2464,8,126,1,126,3,126,2467,8,126,1,126,3,126,
        2470,8,126,1,126,1,126,5,126,2474,8,126,10,126,12,126,2477,9,126,
        1,126,3,126,2480,8,126,1,126,1,126,1,126,1,126,1,126,1,126,1,126,
        1,126,1,126,1,126,1,126,1,126,1,126,3,126,2495,8,126,3,126,2497,
        8,126,1,126,1,126,1,126,3,126,2502,8,126,1,126,1,126,1,126,1,126,
        3,126,2508,8,126,1,126,5,126,2511,8,126,10,126,12,126,2514,9,126,
        1,127,1,127,5,127,2518,8,127,10,127,12,127,2521,9,127,1,128,1,128,
        3,128,2525,8,128,1,128,3,128,2528,8,128,1,128,3,128,2531,8,128,1,
        129,1,129,1,129,1,129,1,130,1,130,3,130,2539,8,130,1,130,1,130,3,
        130,2543,8,130,3,130,2545,8,130,1,131,1,131,1,131,3,131,2550,8,131,
        1,132,1,132,1,132,3,132,2555,8,132,1,132,1,132,1,132,1,132,3,132,
        2561,8,132,1,133,1,133,3,133,2565,8,133,1,134,1,134,3,134,2569,8,
        134,1,135,1,135,1,135,1,135,1,136,1,136,1,136,1,136,3,136,2579,8,
        136,1,136,1,136,3,136,2583,8,136,1,136,1,136,1,136,1,136,1,136,3,
        136,2590,8,136,1,136,1,136,1,136,3,136,2595,8,136,1,136,1,136,1,
        136,1,136,3,136,2601,8,136,1,136,3,136,2604,8,136,1,136,1,136,1,
        136,1,136,3,136,2610,8,136,1,136,1,136,1,136,1,136,1,136,3,136,2617,
        8,136,1,136,1,136,1,136,3,136,2622,8,136,1,136,1,136,1,136,1,136,
        1,136,1,136,1,136,3,136,2631,8,136,1,137,1,137,3,137,2635,8,137,
        1,138,1,138,1,139,1,139,1,139,1,139,1,139,3,139,2644,8,139,1,140,
        1,140,1,141,1,141,1,142,3,142,2651,8,142,1,142,1,142,3,142,2655,
        8,142,5,142,2657,8,142,10,142,12,142,2660,9,142,1,143,1,143,1,143,
        1,143,1,143,3,143,2667,8,143,1,143,1,143,1,143,1,143,1,143,1,143,
        3,143,2675,8,143,1,143,1,143,3,143,2679,8,143,1,143,1,143,1,143,
        3,143,2684,8,143,1,143,1,143,1,143,3,143,2689,8,143,1,143,1,143,
        1,143,1,143,1,143,1,143,1,143,1,143,1,143,1,143,1,143,1,143,3,143,
        2703,8,143,3,143,2705,8,143,1,144,1,144,1,144,1,144,1,144,1,144,
        1,145,1,145,3,145,2715,8,145,1,146,1,146,1,147,1,147,1,148,1,148,
        1,149,1,149,1,149,5,149,2726,8,149,10,149,12,149,2729,9,149,1,150,
        1,150,3,150,2733,8,150,1,150,3,150,2736,8,150,1,151,1,151,1,152,
        1,152,1,152,1,152,3,152,2744,8,152,1,153,1,153,1,153,1,154,1,154,
        1,154,3,154,2752,8,154,1,154,1,154,1,154,1,154,1,154,3,154,2759,
        8,154,1,154,1,154,1,154,1,154,1,154,3,154,2766,8,154,3,154,2768,
        8,154,1,155,1,155,1,155,3,155,2773,8,155,1,155,1,155,1,155,1,155,
        1,155,3,155,2780,8,155,1,156,1,156,1,157,1,157,1,157,1,157,3,157,
        2788,8,157,1,157,1,157,1,157,1,157,1,157,3,157,2795,8,157,1,157,
        1,157,1,157,1,157,1,157,3,157,2802,8,157,1,157,3,157,2805,8,157,
        1,158,1,158,1,158,5,158,2810,8,158,10,158,12,158,2813,9,158,1,159,
        1,159,1,159,1,159,1,160,1,160,1,161,1,161,1,161,1,161,5,161,2825,
        8,161,10,161,12,161,2828,9,161,1,162,1,162,1,162,1,162,1,162,1,162,
        1,162,3,162,2837,8,162,1,163,1,163,1,163,5,163,2842,8,163,10,163,
        12,163,2845,9,163,1,163,1,163,1,163,1,163,5,163,2851,8,163,10,163,
        12,163,2854,9,163,1,163,1,163,1,163,5,163,2859,8,163,10,163,12,163,
        2862,9,163,1,163,1,163,1,163,1,163,5,163,2868,8,163,10,163,12,163,
        2871,9,163,1,163,1,163,1,163,5,163,2876,8,163,10,163,12,163,2879,
        9,163,3,163,2881,8,163,1,164,1,164,1,164,1,164,3,164,2887,8,164,
        1,165,1,165,3,165,2891,8,165,1,166,1,166,3,166,2895,8,166,1,167,
        1,167,1,167,5,167,2900,8,167,10,167,12,167,2903,9,167,1,168,1,168,
        1,168,1,168,1,168,1,168,1,168,1,168,3,168,2913,8,168,1,168,1,168,
        3,168,2917,8,168,5,168,2919,8,168,10,168,12,168,2922,9,168,1,168,
        1,168,1,168,1,168,1,168,1,168,3,168,2930,8,168,1,168,1,168,3,168,
        2934,8,168,5,168,2936,8,168,10,168,12,168,2939,9,168,1,168,3,168,
        2942,8,168,1,169,1,169,3,169,2946,8,169,1,170,1,170,3,170,2950,8,
        170,1,171,1,171,3,171,2954,8,171,1,172,1,172,1,172,3,172,2959,8,
        172,1,172,3,172,2962,8,172,1,172,1,172,1,173,1,173,3,173,2968,8,
        173,1,173,1,173,1,173,3,173,2973,8,173,1,173,1,173,1,173,3,173,2978,
        8,173,1,173,1,173,1,173,3,173,2983,8,173,1,173,3,173,2986,8,173,
        1,174,1,174,3,174,2990,8,174,1,174,1,174,1,174,3,174,2995,8,174,
        1,174,1,174,3,174,2999,8,174,1,174,1,174,3,174,3003,8,174,1,174,
        3,174,3006,8,174,1,175,1,175,1,175,1,175,1,175,1,175,1,175,3,175,
        3015,8,175,1,175,0,5,52,66,68,152,252,176,0,2,4,6,8,10,12,14,16,
        18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,
        62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,
        104,106,108,110,112,114,116,118,120,122,124,126,128,130,132,134,
        136,138,140,142,144,146,148,150,152,154,156,158,160,162,164,166,
        168,170,172,174,176,178,180,182,184,186,188,190,192,194,196,198,
        200,202,204,206,208,210,212,214,216,218,220,222,224,226,228,230,
        232,234,236,238,240,242,244,246,248,250,252,254,256,258,260,262,
        264,266,268,270,272,274,276,278,280,282,284,286,288,290,292,294,
        296,298,300,302,304,306,308,310,312,314,316,318,320,322,324,326,
        328,330,332,334,336,338,340,342,344,346,348,350,0,43,2,0,59,59,307,
        307,2,0,37,37,321,321,1,0,310,311,2,0,24,24,27,27,4,0,139,139,227,
        227,230,230,326,326,4,0,109,109,162,162,206,207,362,362,3,0,110,
        110,112,112,223,223,3,0,68,68,168,172,294,294,2,0,146,146,267,267,
        1,0,69,70,5,0,74,74,80,80,208,208,312,312,348,348,2,0,82,82,225,
        225,2,0,58,58,306,306,1,0,191,192,1,0,83,84,2,0,244,244,327,327,
        2,0,25,26,32,33,1,0,28,30,4,0,21,21,23,23,31,31,34,36,2,0,103,103,
        217,217,3,0,139,139,326,326,331,331,2,0,224,224,268,268,2,0,154,
        154,263,263,2,0,181,181,186,186,4,0,94,94,115,115,243,243,265,265,
        2,0,143,143,184,184,2,0,5,5,14,14,4,0,65,66,98,98,126,127,151,151,
        1,0,319,320,5,0,121,122,128,128,178,178,262,262,353,353,3,0,73,73,
        188,188,322,322,3,0,153,153,189,189,280,280,3,0,157,157,263,263,
        284,284,2,0,48,48,119,119,2,0,133,133,330,330,1,0,283,284,2,0,142,
        142,213,213,1,0,37,43,2,0,22,22,45,47,3,0,48,48,52,52,297,297,1,
        0,258,259,9,0,62,62,71,72,91,91,132,132,200,200,205,205,299,300,
        305,305,349,350,2,0,56,56,116,116,3515,0,352,1,0,0,0,2,358,1,0,0,
        0,4,574,1,0,0,0,6,580,1,0,0,0,8,585,1,0,0,0,10,600,1,0,0,0,12,602,
        1,0,0,0,14,618,1,0,0,0,16,632,1,0,0,0,18,634,1,0,0,0,20,664,1,0,
        0,0,22,666,1,0,0,0,24,681,1,0,0,0,26,684,1,0,0,0,28,709,1,0,0,0,
        30,712,1,0,0,0,32,723,1,0,0,0,34,730,1,0,0,0,36,732,1,0,0,0,38,734,
        1,0,0,0,40,744,1,0,0,0,42,746,1,0,0,0,44,759,1,0,0,0,46,848,1,0,
        0,0,48,850,1,0,0,0,50,854,1,0,0,0,52,939,1,0,0,0,54,960,1,0,0,0,
        56,962,1,0,0,0,58,964,1,0,0,0,60,978,1,0,0,0,62,980,1,0,0,0,64,982,
        1,0,0,0,66,1001,1,0,0,0,68,1634,1,0,0,0,70,1694,1,0,0,0,72,1696,
        1,0,0,0,74,1723,1,0,0,0,76,1725,1,0,0,0,78,1731,1,0,0,0,80,1735,
        1,0,0,0,82,1737,1,0,0,0,84,1742,1,0,0,0,86,1802,1,0,0,0,88,1804,
        1,0,0,0,90,1808,1,0,0,0,92,1814,1,0,0,0,94,1816,1,0,0,0,96,1818,
        1,0,0,0,98,1824,1,0,0,0,100,1828,1,0,0,0,102,1846,1,0,0,0,104,1848,
        1,0,0,0,106,1850,1,0,0,0,108,1858,1,0,0,0,110,1860,1,0,0,0,112,1862,
        1,0,0,0,114,1864,1,0,0,0,116,1869,1,0,0,0,118,1874,1,0,0,0,120,1877,
        1,0,0,0,122,1887,1,0,0,0,124,1892,1,0,0,0,126,1896,1,0,0,0,128,1898,
        1,0,0,0,130,1900,1,0,0,0,132,1902,1,0,0,0,134,1919,1,0,0,0,136,1938,
        1,0,0,0,138,1965,1,0,0,0,140,1967,1,0,0,0,142,1975,1,0,0,0,144,1980,
        1,0,0,0,146,1982,1,0,0,0,148,1990,1,0,0,0,150,1993,1,0,0,0,152,2061,
        1,0,0,0,154,2087,1,0,0,0,156,2091,1,0,0,0,158,2095,1,0,0,0,160,2105,
        1,0,0,0,162,2121,1,0,0,0,164,2137,1,0,0,0,166,2147,1,0,0,0,168,2151,
        1,0,0,0,170,2166,1,0,0,0,172,2173,1,0,0,0,174,2175,1,0,0,0,176,2177,
        1,0,0,0,178,2180,1,0,0,0,180,2196,1,0,0,0,182,2198,1,0,0,0,184,2201,
        1,0,0,0,186,2204,1,0,0,0,188,2212,1,0,0,0,190,2216,1,0,0,0,192,2218,
        1,0,0,0,194,2223,1,0,0,0,196,2234,1,0,0,0,198,2238,1,0,0,0,200,2246,
        1,0,0,0,202,2250,1,0,0,0,204,2255,1,0,0,0,206,2259,1,0,0,0,208,2266,
        1,0,0,0,210,2268,1,0,0,0,212,2271,1,0,0,0,214,2280,1,0,0,0,216,2282,
        1,0,0,0,218,2295,1,0,0,0,220,2297,1,0,0,0,222,2329,1,0,0,0,224,2331,
        1,0,0,0,226,2340,1,0,0,0,228,2342,1,0,0,0,230,2365,1,0,0,0,232,2367,
        1,0,0,0,234,2384,1,0,0,0,236,2386,1,0,0,0,238,2403,1,0,0,0,240,2405,
        1,0,0,0,242,2415,1,0,0,0,244,2418,1,0,0,0,246,2422,1,0,0,0,248,2429,
        1,0,0,0,250,2442,1,0,0,0,252,2496,1,0,0,0,254,2519,1,0,0,0,256,2530,
        1,0,0,0,258,2532,1,0,0,0,260,2544,1,0,0,0,262,2546,1,0,0,0,264,2560,
        1,0,0,0,266,2564,1,0,0,0,268,2568,1,0,0,0,270,2570,1,0,0,0,272,2630,
        1,0,0,0,274,2634,1,0,0,0,276,2636,1,0,0,0,278,2643,1,0,0,0,280,2645,
        1,0,0,0,282,2647,1,0,0,0,284,2650,1,0,0,0,286,2704,1,0,0,0,288,2706,
        1,0,0,0,290,2714,1,0,0,0,292,2716,1,0,0,0,294,2718,1,0,0,0,296,2720,
        1,0,0,0,298,2722,1,0,0,0,300,2730,1,0,0,0,302,2737,1,0,0,0,304,2743,
        1,0,0,0,306,2745,1,0,0,0,308,2767,1,0,0,0,310,2769,1,0,0,0,312,2781,
        1,0,0,0,314,2804,1,0,0,0,316,2806,1,0,0,0,318,2814,1,0,0,0,320,2818,
        1,0,0,0,322,2820,1,0,0,0,324,2836,1,0,0,0,326,2880,1,0,0,0,328,2886,
        1,0,0,0,330,2890,1,0,0,0,332,2894,1,0,0,0,334,2896,1,0,0,0,336,2941,
        1,0,0,0,338,2945,1,0,0,0,340,2949,1,0,0,0,342,2953,1,0,0,0,344,2958,
        1,0,0,0,346,2985,1,0,0,0,348,3005,1,0,0,0,350,3014,1,0,0,0,352,354,
        3,4,2,0,353,355,5,12,0,0,354,353,1,0,0,0,354,355,1,0,0,0,355,356,
        1,0,0,0,356,357,5,0,0,1,357,1,1,0,0,0,358,363,3,4,2,0,359,360,5,
        12,0,0,360,362,3,4,2,0,361,359,1,0,0,0,362,365,1,0,0,0,363,361,1,
        0,0,0,363,364,1,0,0,0,364,367,1,0,0,0,365,363,1,0,0,0,366,368,5,
        12,0,0,367,366,1,0,0,0,367,368,1,0,0,0,368,369,1,0,0,0,369,370,5,
        0,0,1,370,3,1,0,0,0,371,373,5,137,0,0,372,374,5,50,0,0,373,372,1,
        0,0,0,373,374,1,0,0,0,374,376,1,0,0,0,375,371,1,0,0,0,375,376,1,
        0,0,0,376,378,1,0,0,0,377,379,3,18,9,0,378,377,1,0,0,0,378,379,1,
        0,0,0,379,380,1,0,0,0,380,575,3,244,122,0,381,382,5,167,0,0,382,
        383,5,175,0,0,383,384,3,8,4,0,384,386,3,314,157,0,385,387,3,306,
        153,0,386,385,1,0,0,0,386,387,1,0,0,0,387,575,1,0,0,0,388,389,5,
        333,0,0,389,391,3,8,4,0,390,392,3,308,154,0,391,390,1,0,0,0,391,
        392,1,0,0,0,392,397,1,0,0,0,393,395,5,55,0,0,394,393,1,0,0,0,394,
        395,1,0,0,0,395,396,1,0,0,0,396,398,3,44,22,0,397,394,1,0,0,0,397,
        398,1,0,0,0,398,399,1,0,0,0,399,400,5,291,0,0,400,403,3,316,158,
        0,401,402,5,355,0,0,402,404,3,284,142,0,403,401,1,0,0,0,403,404,
        1,0,0,0,404,406,1,0,0,0,405,407,3,306,153,0,406,405,1,0,0,0,406,
        407,1,0,0,0,407,575,1,0,0,0,408,409,5,114,0,0,409,410,5,152,0,0,
        410,412,3,8,4,0,411,413,3,308,154,0,412,411,1,0,0,0,412,413,1,0,
        0,0,413,418,1,0,0,0,414,416,5,55,0,0,415,414,1,0,0,0,415,416,1,0,
        0,0,416,417,1,0,0,0,417,419,3,44,22,0,418,415,1,0,0,0,418,419,1,
        0,0,0,419,422,1,0,0,0,420,421,5,355,0,0,421,423,3,284,142,0,422,
        420,1,0,0,0,422,423,1,0,0,0,423,425,1,0,0,0,424,426,3,306,153,0,
        425,424,1,0,0,0,425,426,1,0,0,0,426,575,1,0,0,0,427,428,5,242,0,
        0,428,429,5,175,0,0,429,431,3,8,4,0,430,432,3,310,155,0,431,430,
        1,0,0,0,431,432,1,0,0,0,432,433,1,0,0,0,433,434,3,312,156,0,434,
        575,1,0,0,0,435,436,5,130,0,0,436,437,5,152,0,0,437,442,3,8,4,0,
        438,440,5,55,0,0,439,438,1,0,0,0,439,440,1,0,0,0,440,441,1,0,0,0,
        441,443,3,44,22,0,442,439,1,0,0,0,442,443,1,0,0,0,443,446,1,0,0,
        0,444,445,5,355,0,0,445,447,3,284,142,0,446,444,1,0,0,0,446,447,
        1,0,0,0,447,575,1,0,0,0,448,449,5,57,0,0,449,452,3,66,33,0,450,451,
        5,10,0,0,451,453,3,32,16,0,452,450,1,0,0,0,452,453,1,0,0,0,453,575,
        1,0,0,0,454,455,5,261,0,0,455,456,3,44,22,0,456,457,5,55,0,0,457,
        458,3,4,2,0,458,575,1,0,0,0,459,460,5,135,0,0,460,461,3,44,22,0,
        461,462,3,10,5,0,462,575,1,0,0,0,463,464,5,90,0,0,464,465,3,8,4,
        0,465,466,5,152,0,0,466,467,5,301,0,0,467,468,3,12,6,0,468,575,1,
        0,0,0,469,470,5,298,0,0,470,476,5,323,0,0,471,473,5,64,0,0,472,474,
        5,323,0,0,473,472,1,0,0,0,473,474,1,0,0,0,474,476,1,0,0,0,475,469,
        1,0,0,0,475,471,1,0,0,0,476,479,1,0,0,0,477,480,3,326,163,0,478,
        480,3,334,167,0,479,477,1,0,0,0,479,478,1,0,0,0,479,480,1,0,0,0,
        480,575,1,0,0,0,481,482,5,291,0,0,482,483,5,323,0,0,483,575,3,326,
        163,0,484,486,5,87,0,0,485,487,7,0,0,0,486,485,1,0,0,0,486,487,1,
        0,0,0,487,575,1,0,0,0,488,575,5,282,0,0,489,490,5,291,0,0,490,491,
        5,290,0,0,491,492,5,81,0,0,492,493,5,55,0,0,493,498,3,322,161,0,
        494,495,5,10,0,0,495,497,3,322,161,0,496,494,1,0,0,0,497,500,1,0,
        0,0,498,496,1,0,0,0,498,499,1,0,0,0,499,575,1,0,0,0,500,498,1,0,
        0,0,501,502,5,118,0,0,502,575,3,6,3,0,503,504,5,291,0,0,504,507,
        5,281,0,0,505,508,3,44,22,0,506,508,5,215,0,0,507,505,1,0,0,0,507,
        506,1,0,0,0,508,575,1,0,0,0,509,511,5,291,0,0,510,512,5,290,0,0,
        511,510,1,0,0,0,511,512,1,0,0,0,512,516,1,0,0,0,513,514,5,315,0,
        0,514,517,5,363,0,0,515,517,5,318,0,0,516,513,1,0,0,0,516,515,1,
        0,0,0,517,518,1,0,0,0,518,575,3,66,33,0,519,520,5,291,0,0,520,521,
        5,63,0,0,521,522,7,1,0,0,522,575,3,66,33,0,523,525,5,291,0,0,524,
        526,5,290,0,0,525,524,1,0,0,0,525,526,1,0,0,0,526,527,1,0,0,0,527,
        528,3,44,22,0,528,529,7,1,0,0,529,530,3,28,14,0,530,575,1,0,0,0,
        531,532,5,293,0,0,532,575,3,16,8,0,533,534,5,293,0,0,534,575,3,44,
        22,0,535,536,5,293,0,0,536,575,5,63,0,0,537,538,5,293,0,0,538,575,
        5,296,0,0,539,540,5,293,0,0,540,575,5,85,0,0,541,542,5,61,0,0,542,
        543,5,105,0,0,543,546,3,44,22,0,544,545,5,358,0,0,545,547,3,32,16,
        0,546,544,1,0,0,0,546,547,1,0,0,0,547,575,1,0,0,0,548,549,5,117,
        0,0,549,550,5,105,0,0,550,575,3,44,22,0,551,552,5,155,0,0,552,553,
        3,44,22,0,553,554,5,321,0,0,554,555,3,44,22,0,555,575,1,0,0,0,556,
        557,5,279,0,0,557,558,3,44,22,0,558,559,5,152,0,0,559,560,3,44,22,
        0,560,575,1,0,0,0,561,564,5,92,0,0,562,563,5,232,0,0,563,565,5,49,
        0,0,564,562,1,0,0,0,564,565,1,0,0,0,565,566,1,0,0,0,566,567,5,309,
        0,0,567,572,3,8,4,0,568,569,5,15,0,0,569,570,3,168,84,0,570,571,
        5,16,0,0,571,573,1,0,0,0,572,568,1,0,0,0,572,573,1,0,0,0,573,575,
        1,0,0,0,574,375,1,0,0,0,574,381,1,0,0,0,574,388,1,0,0,0,574,408,
        1,0,0,0,574,427,1,0,0,0,574,435,1,0,0,0,574,448,1,0,0,0,574,454,
        1,0,0,0,574,459,1,0,0,0,574,463,1,0,0,0,574,475,1,0,0,0,574,481,
        1,0,0,0,574,484,1,0,0,0,574,488,1,0,0,0,574,489,1,0,0,0,574,501,
        1,0,0,0,574,503,1,0,0,0,574,509,1,0,0,0,574,519,1,0,0,0,574,523,
        1,0,0,0,574,531,1,0,0,0,574,533,1,0,0,0,574,535,1,0,0,0,574,537,
        1,0,0,0,574,539,1,0,0,0,574,541,1,0,0,0,574,548,1,0,0,0,574,551,
        1,0,0,0,574,556,1,0,0,0,574,561,1,0,0,0,575,5,1,0,0,0,576,581,5,
        48,0,0,577,581,5,253,0,0,578,581,7,2,0,0,579,581,5,288,0,0,580,576,
        1,0,0,0,580,577,1,0,0,0,580,578,1,0,0,0,580,579,1,0,0,0,581,7,1,
        0,0,0,582,583,3,44,22,0,583,584,5,11,0,0,584,586,1,0,0,0,585,582,
        1,0,0,0,585,586,1,0,0,0,586,587,1,0,0,0,587,588,3,44,22,0,588,9,
        1,0,0,0,589,590,5,15,0,0,590,595,3,66,33,0,591,592,5,10,0,0,592,
        594,3,66,33,0,593,591,1,0,0,0,594,597,1,0,0,0,595,593,1,0,0,0,595,
        596,1,0,0,0,596,598,1,0,0,0,597,595,1,0,0,0,598,599,5,16,0,0,599,
        601,1,0,0,0,600,589,1,0,0,0,600,601,1,0,0,0,601,11,1,0,0,0,602,603,
        5,358,0,0,603,605,5,15,0,0,604,606,3,14,7,0,605,604,1,0,0,0,605,
        606,1,0,0,0,606,613,1,0,0,0,607,609,5,10,0,0,608,610,3,14,7,0,609,
        608,1,0,0,0,609,610,1,0,0,0,610,612,1,0,0,0,611,607,1,0,0,0,612,
        615,1,0,0,0,613,611,1,0,0,0,613,614,1,0,0,0,614,616,1,0,0,0,615,
        613,1,0,0,0,616,617,5,16,0,0,617,13,1,0,0,0,618,620,5,150,0,0,619,
        621,5,37,0,0,620,619,1,0,0,0,620,621,1,0,0,0,621,622,1,0,0,0,622,
        623,3,32,16,0,623,15,1,0,0,0,624,625,5,323,0,0,625,626,5,177,0,0,
        626,633,5,190,0,0,627,628,5,315,0,0,628,631,5,363,0,0,629,631,5,
        318,0,0,630,627,1,0,0,0,630,629,1,0,0,0,631,633,1,0,0,0,632,624,
        1,0,0,0,632,630,1,0,0,0,633,17,1,0,0,0,634,635,5,292,0,0,635,640,
        3,20,10,0,636,637,5,10,0,0,637,639,3,20,10,0,638,636,1,0,0,0,639,
        642,1,0,0,0,640,638,1,0,0,0,640,641,1,0,0,0,641,19,1,0,0,0,642,640,
        1,0,0,0,643,644,5,113,0,0,644,646,5,345,0,0,645,647,5,321,0,0,646,
        645,1,0,0,0,646,647,1,0,0,0,647,648,1,0,0,0,648,665,3,164,82,0,649,
        650,5,113,0,0,650,652,5,308,0,0,651,653,5,321,0,0,652,651,1,0,0,
        0,652,653,1,0,0,0,653,654,1,0,0,0,654,665,3,164,82,0,655,656,5,296,
        0,0,656,657,7,1,0,0,657,665,3,66,33,0,658,659,5,295,0,0,659,660,
        7,1,0,0,660,665,3,66,33,0,661,662,5,85,0,0,662,663,7,1,0,0,663,665,
        3,66,33,0,664,643,1,0,0,0,664,649,1,0,0,0,664,655,1,0,0,0,664,658,
        1,0,0,0,664,661,1,0,0,0,665,21,1,0,0,0,666,668,5,174,0,0,667,669,
        7,3,0,0,668,667,1,0,0,0,668,669,1,0,0,0,669,670,1,0,0,0,670,672,
        3,32,16,0,671,673,3,34,17,0,672,671,1,0,0,0,672,673,1,0,0,0,673,
        23,1,0,0,0,674,675,5,106,0,0,675,682,3,32,16,0,676,678,5,316,0,0,
        677,679,3,60,30,0,678,677,1,0,0,0,678,679,1,0,0,0,679,680,1,0,0,
        0,680,682,3,32,16,0,681,674,1,0,0,0,681,676,1,0,0,0,682,25,1,0,0,
        0,683,685,7,3,0,0,684,683,1,0,0,0,684,685,1,0,0,0,685,686,1,0,0,
        0,686,687,5,5,0,0,687,27,1,0,0,0,688,690,7,3,0,0,689,688,1,0,0,0,
        689,690,1,0,0,0,690,691,1,0,0,0,691,710,5,4,0,0,692,710,3,26,13,
        0,693,710,3,32,16,0,694,710,5,8,0,0,695,710,3,24,12,0,696,697,5,
        315,0,0,697,710,3,32,16,0,698,710,3,22,11,0,699,700,5,123,0,0,700,
        710,3,32,16,0,701,702,5,344,0,0,702,710,3,32,16,0,703,704,5,334,
        0,0,704,710,3,32,16,0,705,706,5,180,0,0,706,710,3,32,16,0,707,710,
        7,4,0,0,708,710,5,220,0,0,709,689,1,0,0,0,709,692,1,0,0,0,709,693,
        1,0,0,0,709,694,1,0,0,0,709,695,1,0,0,0,709,696,1,0,0,0,709,698,
        1,0,0,0,709,699,1,0,0,0,709,701,1,0,0,0,709,703,1,0,0,0,709,705,
        1,0,0,0,709,707,1,0,0,0,709,708,1,0,0,0,710,29,1,0,0,0,711,713,5,
        368,0,0,712,711,1,0,0,0,713,714,1,0,0,0,714,712,1,0,0,0,714,715,
        1,0,0,0,715,31,1,0,0,0,716,724,5,6,0,0,717,724,5,7,0,0,718,720,5,
        364,0,0,719,721,3,30,15,0,720,719,1,0,0,0,720,721,1,0,0,0,721,722,
        1,0,0,0,722,724,5,367,0,0,723,716,1,0,0,0,723,717,1,0,0,0,723,718,
        1,0,0,0,724,33,1,0,0,0,725,726,3,38,19,0,726,727,5,321,0,0,727,728,
        3,40,20,0,728,731,1,0,0,0,729,731,3,40,20,0,730,725,1,0,0,0,730,
        729,1,0,0,0,731,35,1,0,0,0,732,733,5,5,0,0,733,37,1,0,0,0,734,735,
        7,5,0,0,735,39,1,0,0,0,736,745,3,38,19,0,737,742,5,286,0,0,738,739,
        5,15,0,0,739,740,3,36,18,0,740,741,5,16,0,0,741,743,1,0,0,0,742,
        738,1,0,0,0,742,743,1,0,0,0,743,745,1,0,0,0,744,736,1,0,0,0,744,
        737,1,0,0,0,745,41,1,0,0,0,746,751,3,44,22,0,747,748,5,11,0,0,748,
        750,3,44,22,0,749,747,1,0,0,0,750,753,1,0,0,0,751,749,1,0,0,0,751,
        752,1,0,0,0,752,43,1,0,0,0,753,751,1,0,0,0,754,757,5,365,0,0,755,
        757,3,46,23,0,756,754,1,0,0,0,756,755,1,0,0,0,757,760,1,0,0,0,758,
        760,5,366,0,0,759,756,1,0,0,0,759,758,1,0,0,0,760,45,1,0,0,0,761,
        849,5,298,0,0,762,849,5,125,0,0,763,849,5,88,0,0,764,849,5,329,0,
        0,765,849,5,318,0,0,766,849,5,352,0,0,767,849,5,308,0,0,768,849,
        5,345,0,0,769,849,5,287,0,0,770,849,5,167,0,0,771,849,5,333,0,0,
        772,849,5,114,0,0,773,849,5,130,0,0,774,849,5,292,0,0,775,849,5,
        281,0,0,776,849,5,342,0,0,777,849,5,241,0,0,778,849,5,351,0,0,779,
        849,5,76,0,0,780,849,5,334,0,0,781,849,5,229,0,0,782,849,5,90,0,
        0,783,849,5,150,0,0,784,849,5,61,0,0,785,849,5,117,0,0,786,849,5,
        105,0,0,787,849,5,190,0,0,788,849,5,141,0,0,789,849,5,309,0,0,790,
        849,5,201,0,0,791,849,5,307,0,0,792,849,5,118,0,0,793,849,5,253,
        0,0,794,849,5,310,0,0,795,849,5,311,0,0,796,849,5,288,0,0,797,849,
        3,294,147,0,798,849,3,126,63,0,799,849,3,130,65,0,800,849,3,88,44,
        0,801,849,5,60,0,0,802,849,5,67,0,0,803,849,5,75,0,0,804,849,5,95,
        0,0,805,849,5,142,0,0,806,849,5,183,0,0,807,849,5,213,0,0,808,849,
        5,226,0,0,809,849,5,255,0,0,810,849,5,169,0,0,811,849,5,170,0,0,
        812,849,5,171,0,0,813,849,5,146,0,0,814,849,5,147,0,0,815,849,5,
        69,0,0,816,849,5,74,0,0,817,849,5,208,0,0,818,849,5,68,0,0,819,849,
        5,70,0,0,820,849,5,80,0,0,821,849,5,106,0,0,822,849,5,110,0,0,823,
        849,5,112,0,0,824,849,5,120,0,0,825,849,5,123,0,0,826,849,5,145,
        0,0,827,849,5,168,0,0,828,849,5,172,0,0,829,849,5,174,0,0,830,849,
        5,180,0,0,831,849,5,223,0,0,832,849,5,224,0,0,833,849,5,244,0,0,
        834,849,5,260,0,0,835,849,5,267,0,0,836,849,5,268,0,0,837,849,5,
        271,0,0,838,849,5,273,0,0,839,849,5,283,0,0,840,849,5,294,0,0,841,
        849,5,312,0,0,842,849,5,315,0,0,843,849,5,316,0,0,844,849,5,317,
        0,0,845,849,5,327,0,0,846,849,5,344,0,0,847,849,5,348,0,0,848,761,
        1,0,0,0,848,762,1,0,0,0,848,763,1,0,0,0,848,764,1,0,0,0,848,765,
        1,0,0,0,848,766,1,0,0,0,848,767,1,0,0,0,848,768,1,0,0,0,848,769,
        1,0,0,0,848,770,1,0,0,0,848,771,1,0,0,0,848,772,1,0,0,0,848,773,
        1,0,0,0,848,774,1,0,0,0,848,775,1,0,0,0,848,776,1,0,0,0,848,777,
        1,0,0,0,848,778,1,0,0,0,848,779,1,0,0,0,848,780,1,0,0,0,848,781,
        1,0,0,0,848,782,1,0,0,0,848,783,1,0,0,0,848,784,1,0,0,0,848,785,
        1,0,0,0,848,786,1,0,0,0,848,787,1,0,0,0,848,788,1,0,0,0,848,789,
        1,0,0,0,848,790,1,0,0,0,848,791,1,0,0,0,848,792,1,0,0,0,848,793,
        1,0,0,0,848,794,1,0,0,0,848,795,1,0,0,0,848,796,1,0,0,0,848,797,
        1,0,0,0,848,798,1,0,0,0,848,799,1,0,0,0,848,800,1,0,0,0,848,801,
        1,0,0,0,848,802,1,0,0,0,848,803,1,0,0,0,848,804,1,0,0,0,848,805,
        1,0,0,0,848,806,1,0,0,0,848,807,1,0,0,0,848,808,1,0,0,0,848,809,
        1,0,0,0,848,810,1,0,0,0,848,811,1,0,0,0,848,812,1,0,0,0,848,813,
        1,0,0,0,848,814,1,0,0,0,848,815,1,0,0,0,848,816,1,0,0,0,848,817,
        1,0,0,0,848,818,1,0,0,0,848,819,1,0,0,0,848,820,1,0,0,0,848,821,
        1,0,0,0,848,822,1,0,0,0,848,823,1,0,0,0,848,824,1,0,0,0,848,825,
        1,0,0,0,848,826,1,0,0,0,848,827,1,0,0,0,848,828,1,0,0,0,848,829,
        1,0,0,0,848,830,1,0,0,0,848,831,1,0,0,0,848,832,1,0,0,0,848,833,
        1,0,0,0,848,834,1,0,0,0,848,835,1,0,0,0,848,836,1,0,0,0,848,837,
        1,0,0,0,848,838,1,0,0,0,848,839,1,0,0,0,848,840,1,0,0,0,848,841,
        1,0,0,0,848,842,1,0,0,0,848,843,1,0,0,0,848,844,1,0,0,0,848,845,
        1,0,0,0,848,846,1,0,0,0,848,847,1,0,0,0,849,47,1,0,0,0,850,851,3,
        44,22,0,851,49,1,0,0,0,852,855,3,44,22,0,853,855,5,104,0,0,854,852,
        1,0,0,0,854,853,1,0,0,0,855,51,1,0,0,0,856,857,6,26,-1,0,857,866,
        7,6,0,0,858,859,5,15,0,0,859,862,3,54,27,0,860,861,5,10,0,0,861,
        863,3,56,28,0,862,860,1,0,0,0,862,863,1,0,0,0,863,864,1,0,0,0,864,
        865,5,16,0,0,865,867,1,0,0,0,866,858,1,0,0,0,866,867,1,0,0,0,867,
        940,1,0,0,0,868,940,7,7,0,0,869,874,5,145,0,0,870,871,5,15,0,0,871,
        872,3,54,27,0,872,873,5,16,0,0,873,875,1,0,0,0,874,870,1,0,0,0,874,
        875,1,0,0,0,875,940,1,0,0,0,876,940,7,8,0,0,877,879,5,120,0,0,878,
        880,5,260,0,0,879,878,1,0,0,0,879,880,1,0,0,0,880,883,1,0,0,0,881,
        883,5,147,0,0,882,877,1,0,0,0,882,881,1,0,0,0,883,940,1,0,0,0,884,
        940,7,9,0,0,885,940,5,106,0,0,886,891,5,315,0,0,887,888,5,15,0,0,
        888,889,3,54,27,0,889,890,5,16,0,0,890,892,1,0,0,0,891,887,1,0,0,
        0,891,892,1,0,0,0,892,894,1,0,0,0,893,895,3,60,30,0,894,893,1,0,
        0,0,894,895,1,0,0,0,895,940,1,0,0,0,896,901,5,316,0,0,897,898,5,
        15,0,0,898,899,3,54,27,0,899,900,5,16,0,0,900,902,1,0,0,0,901,897,
        1,0,0,0,901,902,1,0,0,0,902,904,1,0,0,0,903,905,3,60,30,0,904,903,
        1,0,0,0,904,905,1,0,0,0,905,940,1,0,0,0,906,940,5,317,0,0,907,909,
        5,174,0,0,908,910,3,34,17,0,909,908,1,0,0,0,909,910,1,0,0,0,910,
        940,1,0,0,0,911,940,7,10,0,0,912,917,5,123,0,0,913,914,5,15,0,0,
        914,915,3,54,27,0,915,916,5,16,0,0,916,918,1,0,0,0,917,913,1,0,0,
        0,917,918,1,0,0,0,918,940,1,0,0,0,919,920,5,283,0,0,920,921,5,15,
        0,0,921,926,3,64,32,0,922,923,5,10,0,0,923,925,3,64,32,0,924,922,
        1,0,0,0,925,928,1,0,0,0,926,924,1,0,0,0,926,927,1,0,0,0,927,929,
        1,0,0,0,928,926,1,0,0,0,929,930,5,16,0,0,930,940,1,0,0,0,931,940,
        5,229,0,0,932,940,5,271,0,0,933,940,5,273,0,0,934,940,5,180,0,0,
        935,940,5,344,0,0,936,940,5,351,0,0,937,940,5,76,0,0,938,940,5,334,
        0,0,939,856,1,0,0,0,939,868,1,0,0,0,939,869,1,0,0,0,939,876,1,0,
        0,0,939,882,1,0,0,0,939,884,1,0,0,0,939,885,1,0,0,0,939,886,1,0,
        0,0,939,896,1,0,0,0,939,906,1,0,0,0,939,907,1,0,0,0,939,911,1,0,
        0,0,939,912,1,0,0,0,939,919,1,0,0,0,939,931,1,0,0,0,939,932,1,0,
        0,0,939,933,1,0,0,0,939,934,1,0,0,0,939,935,1,0,0,0,939,936,1,0,
        0,0,939,937,1,0,0,0,939,938,1,0,0,0,940,957,1,0,0,0,941,942,10,2,
        0,0,942,947,5,53,0,0,943,944,5,17,0,0,944,945,3,62,31,0,945,946,
        5,18,0,0,946,948,1,0,0,0,947,943,1,0,0,0,947,948,1,0,0,0,948,956,
        1,0,0,0,949,950,10,1,0,0,950,952,5,17,0,0,951,953,3,62,31,0,952,
        951,1,0,0,0,952,953,1,0,0,0,953,954,1,0,0,0,954,956,5,18,0,0,955,
        941,1,0,0,0,955,949,1,0,0,0,956,959,1,0,0,0,957,955,1,0,0,0,957,
        958,1,0,0,0,958,53,1,0,0,0,959,957,1,0,0,0,960,961,5,5,0,0,961,55,
        1,0,0,0,962,963,5,5,0,0,963,57,1,0,0,0,964,965,7,11,0,0,965,59,1,
        0,0,0,966,970,5,358,0,0,967,968,5,315,0,0,968,971,5,363,0,0,969,
        971,5,318,0,0,970,967,1,0,0,0,970,969,1,0,0,0,971,979,1,0,0,0,972,
        976,5,359,0,0,973,974,5,315,0,0,974,977,5,363,0,0,975,977,5,318,
        0,0,976,973,1,0,0,0,976,975,1,0,0,0,977,979,1,0,0,0,978,966,1,0,
        0,0,978,972,1,0,0,0,979,61,1,0,0,0,980,981,5,5,0,0,981,63,1,0,0,
        0,982,983,3,44,22,0,983,984,3,52,26,0,984,65,1,0,0,0,985,986,6,33,
        -1,0,986,988,3,68,34,0,987,989,5,216,0,0,988,987,1,0,0,0,988,989,
        1,0,0,0,989,990,1,0,0,0,990,992,5,67,0,0,991,993,7,12,0,0,992,991,
        1,0,0,0,992,993,1,0,0,0,993,994,1,0,0,0,994,995,3,68,34,0,995,996,
        5,51,0,0,996,997,3,68,34,0,997,1002,1,0,0,0,998,999,5,216,0,0,999,
        1002,3,66,33,4,1000,1002,3,68,34,0,1001,985,1,0,0,0,1001,998,1,0,
        0,0,1001,1000,1,0,0,0,1002,1131,1,0,0,0,1003,1004,10,26,0,0,1004,
        1005,5,238,0,0,1005,1130,3,66,33,27,1006,1007,10,25,0,0,1007,1008,
        5,302,0,0,1008,1009,5,238,0,0,1009,1130,3,66,33,26,1010,1011,10,
        24,0,0,1011,1012,5,129,0,0,1012,1130,3,66,33,25,1013,1014,10,23,
        0,0,1014,1015,5,89,0,0,1015,1130,3,66,33,24,1016,1017,10,22,0,0,
        1017,1018,5,302,0,0,1018,1019,5,89,0,0,1019,1130,3,66,33,23,1020,
        1021,10,21,0,0,1021,1022,5,256,0,0,1022,1130,3,66,33,22,1023,1024,
        10,20,0,0,1024,1025,5,302,0,0,1025,1026,5,256,0,0,1026,1130,3,66,
        33,21,1027,1028,10,19,0,0,1028,1029,5,164,0,0,1029,1030,5,256,0,
        0,1030,1130,3,66,33,20,1031,1032,10,18,0,0,1032,1033,5,304,0,0,1033,
        1130,3,66,33,19,1034,1035,10,17,0,0,1035,1036,5,302,0,0,1036,1037,
        5,304,0,0,1037,1130,3,66,33,18,1038,1039,10,16,0,0,1039,1040,5,164,
        0,0,1040,1041,5,304,0,0,1041,1130,3,66,33,17,1042,1043,10,15,0,0,
        1043,1044,5,182,0,0,1044,1130,3,66,33,16,1045,1046,10,14,0,0,1046,
        1047,5,302,0,0,1047,1048,5,182,0,0,1048,1130,3,66,33,15,1049,1050,
        10,13,0,0,1050,1051,5,164,0,0,1051,1052,5,182,0,0,1052,1130,3,66,
        33,14,1053,1054,10,12,0,0,1054,1055,5,187,0,0,1055,1130,3,66,33,
        13,1056,1057,10,11,0,0,1057,1058,5,302,0,0,1058,1059,5,187,0,0,1059,
        1130,3,66,33,12,1060,1061,10,10,0,0,1061,1062,5,164,0,0,1062,1063,
        5,187,0,0,1063,1130,3,66,33,11,1064,1065,10,9,0,0,1065,1066,3,276,
        138,0,1066,1067,3,66,33,10,1067,1130,1,0,0,0,1068,1069,10,5,0,0,
        1069,1071,5,176,0,0,1070,1072,5,216,0,0,1071,1070,1,0,0,0,1071,1072,
        1,0,0,0,1072,1073,1,0,0,0,1073,1074,5,119,0,0,1074,1075,5,152,0,
        0,1075,1130,3,66,33,6,1076,1077,10,3,0,0,1077,1078,5,51,0,0,1078,
        1130,3,66,33,4,1079,1080,10,2,0,0,1080,1081,5,232,0,0,1081,1130,
        3,66,33,3,1082,1084,10,30,0,0,1083,1085,5,216,0,0,1084,1083,1,0,
        0,0,1084,1085,1,0,0,0,1085,1086,1,0,0,0,1086,1087,5,165,0,0,1087,
        1130,3,278,139,0,1088,1090,10,29,0,0,1089,1091,5,216,0,0,1090,1089,
        1,0,0,0,1090,1091,1,0,0,0,1091,1092,1,0,0,0,1092,1093,7,13,0,0,1093,
        1096,3,68,34,0,1094,1095,5,131,0,0,1095,1097,3,68,34,0,1096,1094,
        1,0,0,0,1096,1097,1,0,0,0,1097,1130,1,0,0,0,1098,1100,10,28,0,0,
        1099,1101,5,216,0,0,1100,1099,1,0,0,0,1100,1101,1,0,0,0,1101,1102,
        1,0,0,0,1102,1103,5,193,0,0,1103,1106,3,68,34,0,1104,1105,5,144,
        0,0,1105,1107,3,68,34,0,1106,1104,1,0,0,0,1106,1107,1,0,0,0,1107,
        1130,1,0,0,0,1108,1109,10,27,0,0,1109,1110,3,280,140,0,1110,1111,
        3,68,34,0,1111,1130,1,0,0,0,1112,1113,10,8,0,0,1113,1114,3,276,138,
        0,1114,1115,3,282,141,0,1115,1116,3,274,137,0,1116,1130,1,0,0,0,
        1117,1118,10,7,0,0,1118,1120,5,176,0,0,1119,1121,5,216,0,0,1120,
        1119,1,0,0,0,1120,1121,1,0,0,0,1121,1122,1,0,0,0,1122,1130,3,72,
        36,0,1123,1124,10,6,0,0,1124,1126,5,176,0,0,1125,1127,5,216,0,0,
        1126,1125,1,0,0,0,1126,1127,1,0,0,0,1127,1128,1,0,0,0,1128,1130,
        5,220,0,0,1129,1003,1,0,0,0,1129,1006,1,0,0,0,1129,1010,1,0,0,0,
        1129,1013,1,0,0,0,1129,1016,1,0,0,0,1129,1020,1,0,0,0,1129,1023,
        1,0,0,0,1129,1027,1,0,0,0,1129,1031,1,0,0,0,1129,1034,1,0,0,0,1129,
        1038,1,0,0,0,1129,1042,1,0,0,0,1129,1045,1,0,0,0,1129,1049,1,0,0,
        0,1129,1053,1,0,0,0,1129,1056,1,0,0,0,1129,1060,1,0,0,0,1129,1064,
        1,0,0,0,1129,1068,1,0,0,0,1129,1076,1,0,0,0,1129,1079,1,0,0,0,1129,
        1082,1,0,0,0,1129,1088,1,0,0,0,1129,1098,1,0,0,0,1129,1108,1,0,0,
        0,1129,1112,1,0,0,0,1129,1117,1,0,0,0,1129,1123,1,0,0,0,1130,1133,
        1,0,0,0,1131,1129,1,0,0,0,1131,1132,1,0,0,0,1132,67,1,0,0,0,1133,
        1131,1,0,0,0,1134,1135,6,34,-1,0,1135,1635,3,270,135,0,1136,1137,
        5,15,0,0,1137,1138,3,66,33,0,1138,1139,5,16,0,0,1139,1635,1,0,0,
        0,1140,1635,3,28,14,0,1141,1142,5,24,0,0,1142,1635,3,68,34,63,1143,
        1144,5,27,0,0,1144,1635,3,68,34,62,1145,1146,5,22,0,0,1146,1635,
        3,68,34,59,1147,1635,3,78,39,0,1148,1635,3,82,41,0,1149,1635,3,286,
        143,0,1150,1151,3,86,43,0,1151,1152,5,237,0,0,1152,1153,3,100,50,
        0,1153,1635,1,0,0,0,1154,1635,3,102,51,0,1155,1156,5,212,0,0,1156,
        1635,3,270,135,0,1157,1158,5,211,0,0,1158,1635,3,270,135,0,1159,
        1160,5,77,0,0,1160,1162,3,66,33,0,1161,1163,3,114,57,0,1162,1161,
        1,0,0,0,1163,1164,1,0,0,0,1164,1162,1,0,0,0,1164,1165,1,0,0,0,1165,
        1167,1,0,0,0,1166,1168,3,118,59,0,1167,1166,1,0,0,0,1167,1168,1,
        0,0,0,1168,1169,1,0,0,0,1169,1170,5,125,0,0,1170,1635,1,0,0,0,1171,
        1173,5,77,0,0,1172,1174,3,116,58,0,1173,1172,1,0,0,0,1174,1175,1,
        0,0,0,1175,1173,1,0,0,0,1175,1176,1,0,0,0,1176,1178,1,0,0,0,1177,
        1179,3,118,59,0,1178,1177,1,0,0,0,1178,1179,1,0,0,0,1179,1180,1,
        0,0,0,1180,1181,5,125,0,0,1181,1635,1,0,0,0,1182,1183,5,221,0,0,
        1183,1184,5,15,0,0,1184,1185,3,66,33,0,1185,1186,5,10,0,0,1186,1187,
        3,66,33,0,1187,1188,5,16,0,0,1188,1635,1,0,0,0,1189,1190,5,86,0,
        0,1190,1191,5,15,0,0,1191,1196,3,66,33,0,1192,1193,5,10,0,0,1193,
        1195,3,66,33,0,1194,1192,1,0,0,0,1195,1198,1,0,0,0,1196,1194,1,0,
        0,0,1196,1197,1,0,0,0,1197,1199,1,0,0,0,1198,1196,1,0,0,0,1199,1200,
        5,16,0,0,1200,1635,1,0,0,0,1201,1202,5,78,0,0,1202,1203,5,15,0,0,
        1203,1204,3,66,33,0,1204,1205,5,55,0,0,1205,1206,3,52,26,0,1206,
        1207,5,16,0,0,1207,1635,1,0,0,0,1208,1635,3,136,68,0,1209,1635,3,
        74,37,0,1210,1635,3,84,42,0,1211,1212,5,136,0,0,1212,1635,3,270,
        135,0,1213,1214,3,44,22,0,1214,1215,5,11,0,0,1215,1217,1,0,0,0,1216,
        1213,1,0,0,0,1216,1217,1,0,0,0,1217,1218,1,0,0,0,1218,1219,5,158,
        0,0,1219,1223,5,15,0,0,1220,1221,3,66,33,0,1221,1222,5,10,0,0,1222,
        1224,1,0,0,0,1223,1220,1,0,0,0,1223,1224,1,0,0,0,1224,1225,1,0,0,
        0,1225,1226,3,66,33,0,1226,1227,5,10,0,0,1227,1228,3,66,33,0,1228,
        1229,5,16,0,0,1229,1635,1,0,0,0,1230,1231,3,44,22,0,1231,1232,5,
        11,0,0,1232,1234,1,0,0,0,1233,1230,1,0,0,0,1233,1234,1,0,0,0,1234,
        1235,1,0,0,0,1235,1236,5,160,0,0,1236,1240,5,15,0,0,1237,1238,3,
        66,33,0,1238,1239,5,10,0,0,1239,1241,1,0,0,0,1240,1237,1,0,0,0,1240,
        1241,1,0,0,0,1241,1242,1,0,0,0,1242,1243,3,66,33,0,1243,1244,5,10,
        0,0,1244,1245,3,66,33,0,1245,1246,5,16,0,0,1246,1635,1,0,0,0,1247,
        1248,3,44,22,0,1248,1249,5,11,0,0,1249,1251,1,0,0,0,1250,1247,1,
        0,0,0,1250,1251,1,0,0,0,1251,1252,1,0,0,0,1252,1253,5,159,0,0,1253,
        1257,5,15,0,0,1254,1255,3,66,33,0,1255,1256,5,10,0,0,1256,1258,1,
        0,0,0,1257,1254,1,0,0,0,1257,1258,1,0,0,0,1258,1259,1,0,0,0,1259,
        1260,3,66,33,0,1260,1261,5,10,0,0,1261,1262,3,66,33,0,1262,1263,
        5,16,0,0,1263,1635,1,0,0,0,1264,1265,3,44,22,0,1265,1266,5,11,0,
        0,1266,1268,1,0,0,0,1267,1264,1,0,0,0,1267,1268,1,0,0,0,1268,1269,
        1,0,0,0,1269,1270,5,352,0,0,1270,1271,5,15,0,0,1271,1635,5,16,0,
        0,1272,1273,3,44,22,0,1273,1274,5,11,0,0,1274,1276,1,0,0,0,1275,
        1272,1,0,0,0,1275,1276,1,0,0,0,1276,1277,1,0,0,0,1277,1278,5,248,
        0,0,1278,1279,5,15,0,0,1279,1280,3,82,41,0,1280,1281,5,16,0,0,1281,
        1635,1,0,0,0,1282,1283,3,44,22,0,1283,1284,5,11,0,0,1284,1286,1,
        0,0,0,1285,1282,1,0,0,0,1285,1286,1,0,0,0,1286,1287,1,0,0,0,1287,
        1288,5,251,0,0,1288,1289,5,15,0,0,1289,1290,3,82,41,0,1290,1291,
        5,16,0,0,1291,1635,1,0,0,0,1292,1293,5,255,0,0,1293,1294,5,15,0,
        0,1294,1295,3,66,33,0,1295,1296,5,165,0,0,1296,1299,3,66,33,0,1297,
        1298,5,343,0,0,1298,1300,3,58,29,0,1299,1297,1,0,0,0,1299,1300,1,
        0,0,0,1300,1301,1,0,0,0,1301,1302,5,16,0,0,1302,1635,1,0,0,0,1303,
        1304,5,138,0,0,1304,1305,5,15,0,0,1305,1306,3,124,62,0,1306,1307,
        5,152,0,0,1307,1308,3,66,33,0,1308,1309,5,16,0,0,1309,1635,1,0,0,
        0,1310,1311,7,14,0,0,1311,1312,5,15,0,0,1312,1315,3,66,33,0,1313,
        1314,5,343,0,0,1314,1316,3,58,29,0,1315,1313,1,0,0,0,1315,1316,1,
        0,0,0,1316,1317,1,0,0,0,1317,1318,5,16,0,0,1318,1635,1,0,0,0,1319,
        1320,7,15,0,0,1320,1321,5,15,0,0,1321,1322,3,66,33,0,1322,1323,5,
        10,0,0,1323,1324,3,66,33,0,1324,1325,5,16,0,0,1325,1635,1,0,0,0,
        1326,1327,3,44,22,0,1327,1328,5,11,0,0,1328,1330,1,0,0,0,1329,1326,
        1,0,0,0,1329,1330,1,0,0,0,1330,1331,1,0,0,0,1331,1332,3,44,22,0,
        1332,1341,5,15,0,0,1333,1338,3,66,33,0,1334,1335,5,10,0,0,1335,1337,
        3,66,33,0,1336,1334,1,0,0,0,1337,1340,1,0,0,0,1338,1336,1,0,0,0,
        1338,1339,1,0,0,0,1339,1342,1,0,0,0,1340,1338,1,0,0,0,1341,1333,
        1,0,0,0,1341,1342,1,0,0,0,1342,1343,1,0,0,0,1343,1344,5,16,0,0,1344,
        1635,1,0,0,0,1345,1346,5,303,0,0,1346,1347,5,15,0,0,1347,1368,3,
        66,33,0,1348,1350,5,152,0,0,1349,1348,1,0,0,0,1349,1350,1,0,0,0,
        1350,1351,1,0,0,0,1351,1356,3,66,33,0,1352,1354,5,149,0,0,1353,1352,
        1,0,0,0,1353,1354,1,0,0,0,1354,1355,1,0,0,0,1355,1357,3,66,33,0,
        1356,1353,1,0,0,0,1356,1357,1,0,0,0,1357,1360,1,0,0,0,1358,1359,
        5,343,0,0,1359,1361,3,58,29,0,1360,1358,1,0,0,0,1360,1361,1,0,0,
        0,1361,1369,1,0,0,0,1362,1363,5,10,0,0,1363,1366,3,66,33,0,1364,
        1365,5,10,0,0,1365,1367,3,66,33,0,1366,1364,1,0,0,0,1366,1367,1,
        0,0,0,1367,1369,1,0,0,0,1368,1349,1,0,0,0,1368,1362,1,0,0,0,1369,
        1370,1,0,0,0,1370,1371,5,16,0,0,1371,1635,1,0,0,0,1372,1373,5,324,
        0,0,1373,1375,5,15,0,0,1374,1376,3,132,66,0,1375,1374,1,0,0,0,1375,
        1376,1,0,0,0,1376,1384,1,0,0,0,1377,1378,3,66,33,0,1378,1379,5,152,
        0,0,1379,1380,3,66,33,0,1380,1385,1,0,0,0,1381,1382,5,152,0,0,1382,
        1385,3,66,33,0,1383,1385,3,66,33,0,1384,1377,1,0,0,0,1384,1381,1,
        0,0,0,1384,1383,1,0,0,0,1385,1386,1,0,0,0,1386,1387,5,16,0,0,1387,
        1635,1,0,0,0,1388,1389,5,340,0,0,1389,1390,5,15,0,0,1390,1391,3,
        66,33,0,1391,1392,5,16,0,0,1392,1635,1,0,0,0,1393,1394,5,341,0,0,
        1394,1395,5,15,0,0,1395,1396,3,66,33,0,1396,1397,5,16,0,0,1397,1635,
        1,0,0,0,1398,1399,5,336,0,0,1399,1400,5,15,0,0,1400,1401,3,66,33,
        0,1401,1402,5,16,0,0,1402,1635,1,0,0,0,1403,1404,5,338,0,0,1404,
        1405,5,15,0,0,1405,1406,3,66,33,0,1406,1407,5,16,0,0,1407,1635,1,
        0,0,0,1408,1409,5,337,0,0,1409,1410,5,15,0,0,1410,1411,3,66,33,0,
        1411,1412,5,16,0,0,1412,1635,1,0,0,0,1413,1414,5,339,0,0,1414,1415,
        5,15,0,0,1415,1416,3,66,33,0,1416,1417,5,16,0,0,1417,1635,1,0,0,
        0,1418,1419,5,335,0,0,1419,1420,5,15,0,0,1420,1421,3,66,33,0,1421,
        1422,5,16,0,0,1422,1635,1,0,0,0,1423,1424,5,239,0,0,1424,1425,5,
        15,0,0,1425,1426,3,66,33,0,1426,1427,5,252,0,0,1427,1428,3,66,33,
        0,1428,1429,5,152,0,0,1429,1432,3,66,33,0,1430,1431,5,149,0,0,1431,
        1433,3,66,33,0,1432,1430,1,0,0,0,1432,1433,1,0,0,0,1433,1436,1,0,
        0,0,1434,1435,5,343,0,0,1435,1437,3,58,29,0,1436,1434,1,0,0,0,1436,
        1437,1,0,0,0,1437,1438,1,0,0,0,1438,1439,5,16,0,0,1439,1635,1,0,
        0,0,1440,1441,5,276,0,0,1441,1442,5,15,0,0,1442,1443,3,66,33,0,1443,
        1444,5,10,0,0,1444,1445,3,66,33,0,1445,1446,5,10,0,0,1446,1447,3,
        66,33,0,1447,1448,5,16,0,0,1448,1635,1,0,0,0,1449,1450,5,272,0,0,
        1450,1451,5,15,0,0,1451,1452,3,66,33,0,1452,1453,5,10,0,0,1453,1454,
        3,32,16,0,1454,1455,5,10,0,0,1455,1462,3,32,16,0,1456,1457,5,10,
        0,0,1457,1460,3,26,13,0,1458,1459,5,10,0,0,1459,1461,3,26,13,0,1460,
        1458,1,0,0,0,1460,1461,1,0,0,0,1461,1463,1,0,0,0,1462,1456,1,0,0,
        0,1462,1463,1,0,0,0,1463,1466,1,0,0,0,1464,1465,5,10,0,0,1465,1467,
        3,32,16,0,1466,1464,1,0,0,0,1466,1467,1,0,0,0,1467,1468,1,0,0,0,
        1468,1469,5,16,0,0,1469,1635,1,0,0,0,1470,1471,3,44,22,0,1471,1472,
        5,11,0,0,1472,1474,1,0,0,0,1473,1470,1,0,0,0,1473,1474,1,0,0,0,1474,
        1475,1,0,0,0,1475,1635,5,104,0,0,1476,1477,3,44,22,0,1477,1478,5,
        11,0,0,1478,1480,1,0,0,0,1479,1476,1,0,0,0,1479,1480,1,0,0,0,1480,
        1481,1,0,0,0,1481,1484,5,99,0,0,1482,1483,5,15,0,0,1483,1485,5,16,
        0,0,1484,1482,1,0,0,0,1484,1485,1,0,0,0,1485,1635,1,0,0,0,1486,1487,
        3,44,22,0,1487,1488,5,11,0,0,1488,1490,1,0,0,0,1489,1486,1,0,0,0,
        1489,1490,1,0,0,0,1490,1491,1,0,0,0,1491,1492,5,100,0,0,1492,1493,
        5,15,0,0,1493,1494,3,66,33,0,1494,1495,5,16,0,0,1495,1635,1,0,0,
        0,1496,1497,3,44,22,0,1497,1498,5,11,0,0,1498,1500,1,0,0,0,1499,
        1496,1,0,0,0,1499,1500,1,0,0,0,1500,1501,1,0,0,0,1501,1504,5,96,
        0,0,1502,1503,5,15,0,0,1503,1505,5,16,0,0,1504,1502,1,0,0,0,1504,
        1505,1,0,0,0,1505,1635,1,0,0,0,1506,1507,3,44,22,0,1507,1508,5,11,
        0,0,1508,1510,1,0,0,0,1509,1506,1,0,0,0,1509,1510,1,0,0,0,1510,1511,
        1,0,0,0,1511,1522,5,246,0,0,1512,1513,5,15,0,0,1513,1514,3,66,33,
        0,1514,1515,5,10,0,0,1515,1518,3,66,33,0,1516,1517,5,10,0,0,1517,
        1519,3,66,33,0,1518,1516,1,0,0,0,1518,1519,1,0,0,0,1519,1520,1,0,
        0,0,1520,1521,5,16,0,0,1521,1523,1,0,0,0,1522,1512,1,0,0,0,1522,
        1523,1,0,0,0,1523,1635,1,0,0,0,1524,1525,3,44,22,0,1525,1526,5,11,
        0,0,1526,1528,1,0,0,0,1527,1524,1,0,0,0,1527,1528,1,0,0,0,1528,1529,
        1,0,0,0,1529,1534,5,245,0,0,1530,1531,5,15,0,0,1531,1532,3,66,33,
        0,1532,1533,5,16,0,0,1533,1535,1,0,0,0,1534,1530,1,0,0,0,1534,1535,
        1,0,0,0,1535,1635,1,0,0,0,1536,1537,3,44,22,0,1537,1538,5,11,0,0,
        1538,1540,1,0,0,0,1539,1536,1,0,0,0,1539,1540,1,0,0,0,1540,1541,
        1,0,0,0,1541,1542,5,247,0,0,1542,1543,5,15,0,0,1543,1549,3,66,33,
        0,1544,1545,5,10,0,0,1545,1546,3,66,33,0,1546,1547,5,10,0,0,1547,
        1548,3,66,33,0,1548,1550,1,0,0,0,1549,1544,1,0,0,0,1549,1550,1,0,
        0,0,1550,1551,1,0,0,0,1551,1552,5,16,0,0,1552,1635,1,0,0,0,1553,
        1554,5,249,0,0,1554,1555,5,15,0,0,1555,1556,3,66,33,0,1556,1557,
        5,16,0,0,1557,1635,1,0,0,0,1558,1559,5,250,0,0,1559,1560,5,15,0,
        0,1560,1561,3,66,33,0,1561,1562,5,16,0,0,1562,1635,1,0,0,0,1563,
        1635,3,70,35,0,1564,1565,5,101,0,0,1565,1566,5,15,0,0,1566,1567,
        3,66,33,0,1567,1568,5,16,0,0,1568,1635,1,0,0,0,1569,1574,5,102,0,
        0,1570,1571,5,15,0,0,1571,1572,3,54,27,0,1572,1573,5,16,0,0,1573,
        1575,1,0,0,0,1574,1570,1,0,0,0,1574,1575,1,0,0,0,1575,1635,1,0,0,
        0,1576,1581,5,197,0,0,1577,1578,5,15,0,0,1578,1579,3,54,27,0,1579,
        1580,5,16,0,0,1580,1582,1,0,0,0,1581,1577,1,0,0,0,1581,1582,1,0,
        0,0,1582,1635,1,0,0,0,1583,1584,5,108,0,0,1584,1585,5,15,0,0,1585,
        1586,3,134,67,0,1586,1587,5,10,0,0,1587,1590,3,66,33,0,1588,1589,
        5,10,0,0,1589,1591,3,32,16,0,1590,1588,1,0,0,0,1590,1591,1,0,0,0,
        1591,1592,1,0,0,0,1592,1593,5,16,0,0,1593,1635,1,0,0,0,1594,1595,
        5,107,0,0,1595,1596,5,15,0,0,1596,1597,3,22,11,0,1597,1598,5,10,
        0,0,1598,1601,3,66,33,0,1599,1600,5,10,0,0,1600,1602,3,66,33,0,1601,
        1599,1,0,0,0,1601,1602,1,0,0,0,1602,1603,1,0,0,0,1603,1604,5,16,
        0,0,1604,1635,1,0,0,0,1605,1606,5,264,0,0,1606,1607,5,15,0,0,1607,
        1608,3,22,11,0,1608,1609,5,10,0,0,1609,1612,3,66,33,0,1610,1611,
        5,10,0,0,1611,1613,3,66,33,0,1612,1610,1,0,0,0,1612,1613,1,0,0,0,
        1613,1614,1,0,0,0,1614,1615,5,16,0,0,1615,1635,1,0,0,0,1616,1617,
        5,238,0,0,1617,1618,5,15,0,0,1618,1621,3,66,33,0,1619,1620,5,10,
        0,0,1620,1622,3,66,33,0,1621,1619,1,0,0,0,1622,1623,1,0,0,0,1623,
        1621,1,0,0,0,1623,1624,1,0,0,0,1624,1625,1,0,0,0,1625,1626,5,16,
        0,0,1626,1635,1,0,0,0,1627,1628,5,325,0,0,1628,1629,5,15,0,0,1629,
        1630,3,66,33,0,1630,1631,5,10,0,0,1631,1632,3,66,33,0,1632,1633,
        5,16,0,0,1633,1635,1,0,0,0,1634,1134,1,0,0,0,1634,1136,1,0,0,0,1634,
        1140,1,0,0,0,1634,1141,1,0,0,0,1634,1143,1,0,0,0,1634,1145,1,0,0,
        0,1634,1147,1,0,0,0,1634,1148,1,0,0,0,1634,1149,1,0,0,0,1634,1150,
        1,0,0,0,1634,1154,1,0,0,0,1634,1155,1,0,0,0,1634,1157,1,0,0,0,1634,
        1159,1,0,0,0,1634,1171,1,0,0,0,1634,1182,1,0,0,0,1634,1189,1,0,0,
        0,1634,1201,1,0,0,0,1634,1208,1,0,0,0,1634,1209,1,0,0,0,1634,1210,
        1,0,0,0,1634,1211,1,0,0,0,1634,1216,1,0,0,0,1634,1233,1,0,0,0,1634,
        1250,1,0,0,0,1634,1267,1,0,0,0,1634,1275,1,0,0,0,1634,1285,1,0,0,
        0,1634,1292,1,0,0,0,1634,1303,1,0,0,0,1634,1310,1,0,0,0,1634,1319,
        1,0,0,0,1634,1329,1,0,0,0,1634,1345,1,0,0,0,1634,1372,1,0,0,0,1634,
        1388,1,0,0,0,1634,1393,1,0,0,0,1634,1398,1,0,0,0,1634,1403,1,0,0,
        0,1634,1408,1,0,0,0,1634,1413,1,0,0,0,1634,1418,1,0,0,0,1634,1423,
        1,0,0,0,1634,1440,1,0,0,0,1634,1449,1,0,0,0,1634,1473,1,0,0,0,1634,
        1479,1,0,0,0,1634,1489,1,0,0,0,1634,1499,1,0,0,0,1634,1509,1,0,0,
        0,1634,1527,1,0,0,0,1634,1539,1,0,0,0,1634,1553,1,0,0,0,1634,1558,
        1,0,0,0,1634,1563,1,0,0,0,1634,1564,1,0,0,0,1634,1569,1,0,0,0,1634,
        1576,1,0,0,0,1634,1583,1,0,0,0,1634,1594,1,0,0,0,1634,1605,1,0,0,
        0,1634,1616,1,0,0,0,1634,1627,1,0,0,0,1635,1661,1,0,0,0,1636,1637,
        10,64,0,0,1637,1638,7,16,0,0,1638,1660,3,68,34,65,1639,1640,10,61,
        0,0,1640,1641,7,17,0,0,1641,1660,3,68,34,62,1642,1643,10,60,0,0,
        1643,1644,7,3,0,0,1644,1660,3,68,34,61,1645,1646,10,58,0,0,1646,
        1647,7,18,0,0,1647,1660,3,68,34,59,1648,1649,10,67,0,0,1649,1650,
        5,11,0,0,1650,1660,3,44,22,0,1651,1652,10,66,0,0,1652,1653,5,17,
        0,0,1653,1654,3,66,33,0,1654,1655,5,18,0,0,1655,1660,1,0,0,0,1656,
        1657,10,65,0,0,1657,1658,5,44,0,0,1658,1660,3,52,26,0,1659,1636,
        1,0,0,0,1659,1639,1,0,0,0,1659,1642,1,0,0,0,1659,1645,1,0,0,0,1659,
        1648,1,0,0,0,1659,1651,1,0,0,0,1659,1656,1,0,0,0,1660,1663,1,0,0,
        0,1661,1659,1,0,0,0,1661,1662,1,0,0,0,1662,69,1,0,0,0,1663,1661,
        1,0,0,0,1664,1667,5,97,0,0,1665,1666,5,15,0,0,1666,1668,5,16,0,0,
        1667,1665,1,0,0,0,1667,1668,1,0,0,0,1668,1695,1,0,0,0,1669,1675,
        7,19,0,0,1670,1672,5,15,0,0,1671,1673,3,54,27,0,1672,1671,1,0,0,
        0,1672,1673,1,0,0,0,1673,1674,1,0,0,0,1674,1676,5,16,0,0,1675,1670,
        1,0,0,0,1675,1676,1,0,0,0,1676,1695,1,0,0,0,1677,1680,5,296,0,0,
        1678,1679,5,15,0,0,1679,1681,5,16,0,0,1680,1678,1,0,0,0,1680,1681,
        1,0,0,0,1681,1695,1,0,0,0,1682,1685,5,196,0,0,1683,1684,5,15,0,0,
        1684,1686,5,16,0,0,1685,1683,1,0,0,0,1685,1686,1,0,0,0,1686,1695,
        1,0,0,0,1687,1692,5,198,0,0,1688,1689,5,15,0,0,1689,1690,3,54,27,
        0,1690,1691,5,16,0,0,1691,1693,1,0,0,0,1692,1688,1,0,0,0,1692,1693,
        1,0,0,0,1693,1695,1,0,0,0,1694,1664,1,0,0,0,1694,1669,1,0,0,0,1694,
        1677,1,0,0,0,1694,1682,1,0,0,0,1694,1687,1,0,0,0,1695,71,1,0,0,0,
        1696,1697,7,20,0,0,1697,73,1,0,0,0,1698,1699,7,21,0,0,1699,1708,
        5,15,0,0,1700,1705,3,76,38,0,1701,1702,5,10,0,0,1702,1704,3,76,38,
        0,1703,1701,1,0,0,0,1704,1707,1,0,0,0,1705,1703,1,0,0,0,1705,1706,
        1,0,0,0,1706,1709,1,0,0,0,1707,1705,1,0,0,0,1708,1700,1,0,0,0,1708,
        1709,1,0,0,0,1709,1710,1,0,0,0,1710,1724,5,16,0,0,1711,1720,5,19,
        0,0,1712,1717,3,76,38,0,1713,1714,5,10,0,0,1714,1716,3,76,38,0,1715,
        1713,1,0,0,0,1716,1719,1,0,0,0,1717,1715,1,0,0,0,1717,1718,1,0,0,
        0,1718,1721,1,0,0,0,1719,1717,1,0,0,0,1720,1712,1,0,0,0,1720,1721,
        1,0,0,0,1721,1722,1,0,0,0,1722,1724,5,20,0,0,1723,1698,1,0,0,0,1723,
        1711,1,0,0,0,1724,75,1,0,0,0,1725,1726,3,44,22,0,1726,1727,5,13,
        0,0,1727,1728,3,66,33,0,1728,77,1,0,0,0,1729,1732,5,14,0,0,1730,
        1732,5,9,0,0,1731,1729,1,0,0,0,1731,1730,1,0,0,0,1732,79,1,0,0,0,
        1733,1736,3,28,14,0,1734,1736,3,78,39,0,1735,1733,1,0,0,0,1735,1734,
        1,0,0,0,1736,81,1,0,0,0,1737,1738,3,42,21,0,1738,83,1,0,0,0,1739,
        1740,3,44,22,0,1740,1741,5,11,0,0,1741,1743,1,0,0,0,1742,1739,1,
        0,0,0,1742,1743,1,0,0,0,1743,1744,1,0,0,0,1744,1745,7,22,0,0,1745,
        1746,5,15,0,0,1746,1747,3,66,33,0,1747,1748,5,10,0,0,1748,1751,3,
        66,33,0,1749,1750,5,10,0,0,1750,1752,3,66,33,0,1751,1749,1,0,0,0,
        1751,1752,1,0,0,0,1752,1753,1,0,0,0,1753,1754,5,16,0,0,1754,85,1,
        0,0,0,1755,1756,3,88,44,0,1756,1757,5,15,0,0,1757,1758,5,16,0,0,
        1758,1803,1,0,0,0,1759,1760,5,285,0,0,1760,1761,5,15,0,0,1761,1803,
        5,16,0,0,1762,1803,3,286,143,0,1763,1764,5,219,0,0,1764,1765,5,15,
        0,0,1765,1766,3,90,45,0,1766,1767,5,16,0,0,1767,1803,1,0,0,0,1768,
        1769,7,23,0,0,1769,1770,5,15,0,0,1770,1777,3,66,33,0,1771,1772,5,
        10,0,0,1772,1775,5,5,0,0,1773,1774,5,10,0,0,1774,1776,3,66,33,0,
        1775,1773,1,0,0,0,1775,1776,1,0,0,0,1776,1778,1,0,0,0,1777,1771,
        1,0,0,0,1777,1778,1,0,0,0,1778,1779,1,0,0,0,1779,1781,5,16,0,0,1780,
        1782,3,92,46,0,1781,1780,1,0,0,0,1781,1782,1,0,0,0,1782,1803,1,0,
        0,0,1783,1784,3,94,47,0,1784,1785,5,15,0,0,1785,1786,3,66,33,0,1786,
        1788,5,16,0,0,1787,1789,3,92,46,0,1788,1787,1,0,0,0,1788,1789,1,
        0,0,0,1789,1803,1,0,0,0,1790,1791,5,218,0,0,1791,1792,5,15,0,0,1792,
        1793,3,66,33,0,1793,1794,5,10,0,0,1794,1795,3,96,48,0,1795,1797,
        5,16,0,0,1796,1798,3,98,49,0,1797,1796,1,0,0,0,1797,1798,1,0,0,0,
        1798,1800,1,0,0,0,1799,1801,3,92,46,0,1800,1799,1,0,0,0,1800,1801,
        1,0,0,0,1801,1803,1,0,0,0,1802,1755,1,0,0,0,1802,1759,1,0,0,0,1802,
        1762,1,0,0,0,1802,1763,1,0,0,0,1802,1768,1,0,0,0,1802,1783,1,0,0,
        0,1802,1790,1,0,0,0,1803,87,1,0,0,0,1804,1805,7,24,0,0,1805,89,1,
        0,0,0,1806,1809,5,5,0,0,1807,1809,3,78,39,0,1808,1806,1,0,0,0,1808,
        1807,1,0,0,0,1809,91,1,0,0,0,1810,1811,5,277,0,0,1811,1815,5,222,
        0,0,1812,1813,5,163,0,0,1813,1815,5,222,0,0,1814,1810,1,0,0,0,1814,
        1812,1,0,0,0,1815,93,1,0,0,0,1816,1817,7,25,0,0,1817,95,1,0,0,0,
        1818,1819,7,26,0,0,1819,97,1,0,0,0,1820,1821,5,152,0,0,1821,1825,
        5,142,0,0,1822,1823,5,152,0,0,1823,1825,5,183,0,0,1824,1820,1,0,
        0,0,1824,1822,1,0,0,0,1825,99,1,0,0,0,1826,1829,3,44,22,0,1827,1829,
        3,192,96,0,1828,1826,1,0,0,0,1828,1827,1,0,0,0,1829,101,1,0,0,0,
        1830,1831,5,285,0,0,1831,1832,5,15,0,0,1832,1833,3,104,52,0,1833,
        1834,5,16,0,0,1834,1847,1,0,0,0,1835,1836,5,347,0,0,1836,1837,5,
        15,0,0,1837,1838,3,66,33,0,1838,1839,5,60,0,0,1839,1842,3,106,53,
        0,1840,1841,5,10,0,0,1841,1843,3,112,56,0,1842,1840,1,0,0,0,1842,
        1843,1,0,0,0,1843,1844,1,0,0,0,1844,1845,5,16,0,0,1845,1847,1,0,
        0,0,1846,1830,1,0,0,0,1846,1835,1,0,0,0,1847,103,1,0,0,0,1848,1849,
        7,27,0,0,1849,105,1,0,0,0,1850,1852,3,104,52,0,1851,1853,3,108,54,
        0,1852,1851,1,0,0,0,1852,1853,1,0,0,0,1853,107,1,0,0,0,1854,1855,
        5,24,0,0,1855,1859,3,110,55,0,1856,1857,5,27,0,0,1857,1859,3,110,
        55,0,1858,1854,1,0,0,0,1858,1856,1,0,0,0,1859,109,1,0,0,0,1860,1861,
        7,26,0,0,1861,111,1,0,0,0,1862,1863,3,66,33,0,1863,113,1,0,0,0,1864,
        1865,5,354,0,0,1865,1866,3,120,60,0,1866,1867,5,313,0,0,1867,1868,
        3,66,33,0,1868,115,1,0,0,0,1869,1870,5,354,0,0,1870,1871,3,66,33,
        0,1871,1872,5,313,0,0,1872,1873,3,66,33,0,1873,117,1,0,0,0,1874,
        1875,5,124,0,0,1875,1876,3,66,33,0,1876,119,1,0,0,0,1877,1882,3,
        122,61,0,1878,1879,5,10,0,0,1879,1881,3,122,61,0,1880,1878,1,0,0,
        0,1881,1884,1,0,0,0,1882,1880,1,0,0,0,1882,1883,1,0,0,0,1883,121,
        1,0,0,0,1884,1882,1,0,0,0,1885,1888,3,272,136,0,1886,1888,3,66,33,
        0,1887,1885,1,0,0,0,1887,1886,1,0,0,0,1888,123,1,0,0,0,1889,1893,
        3,126,63,0,1890,1893,3,128,64,0,1891,1893,3,130,65,0,1892,1889,1,
        0,0,0,1892,1890,1,0,0,0,1892,1891,1,0,0,0,1893,125,1,0,0,0,1894,
        1897,3,38,19,0,1895,1897,5,286,0,0,1896,1894,1,0,0,0,1896,1895,1,
        0,0,0,1897,127,1,0,0,0,1898,1899,7,28,0,0,1899,129,1,0,0,0,1900,
        1901,7,29,0,0,1901,131,1,0,0,0,1902,1903,7,30,0,0,1903,133,1,0,0,
        0,1904,1920,5,203,0,0,1905,1920,5,79,0,0,1906,1920,5,111,0,0,1907,
        1920,5,362,0,0,1908,1920,5,262,0,0,1909,1920,5,207,0,0,1910,1920,
        5,353,0,0,1911,1920,5,109,0,0,1912,1920,5,162,0,0,1913,1920,5,206,
        0,0,1914,1920,5,286,0,0,1915,1920,5,204,0,0,1916,1920,5,202,0,0,
        1917,1920,5,209,0,0,1918,1920,3,32,16,0,1919,1904,1,0,0,0,1919,1905,
        1,0,0,0,1919,1906,1,0,0,0,1919,1907,1,0,0,0,1919,1908,1,0,0,0,1919,
        1909,1,0,0,0,1919,1910,1,0,0,0,1919,1911,1,0,0,0,1919,1912,1,0,0,
        0,1919,1913,1,0,0,0,1919,1914,1,0,0,0,1919,1915,1,0,0,0,1919,1916,
        1,0,0,0,1919,1917,1,0,0,0,1919,1918,1,0,0,0,1920,135,1,0,0,0,1921,
        1923,5,53,0,0,1922,1921,1,0,0,0,1922,1923,1,0,0,0,1923,1924,1,0,
        0,0,1924,1933,5,17,0,0,1925,1930,3,66,33,0,1926,1927,5,10,0,0,1927,
        1929,3,66,33,0,1928,1926,1,0,0,0,1929,1932,1,0,0,0,1930,1928,1,0,
        0,0,1930,1931,1,0,0,0,1931,1934,1,0,0,0,1932,1930,1,0,0,0,1933,1925,
        1,0,0,0,1933,1934,1,0,0,0,1934,1935,1,0,0,0,1935,1939,5,18,0,0,1936,
        1937,5,53,0,0,1937,1939,3,270,135,0,1938,1922,1,0,0,0,1938,1936,
        1,0,0,0,1939,137,1,0,0,0,1940,1941,5,283,0,0,1941,1950,5,15,0,0,
        1942,1947,3,66,33,0,1943,1944,5,10,0,0,1944,1946,3,66,33,0,1945,
        1943,1,0,0,0,1946,1949,1,0,0,0,1947,1945,1,0,0,0,1947,1948,1,0,0,
        0,1948,1951,1,0,0,0,1949,1947,1,0,0,0,1950,1942,1,0,0,0,1950,1951,
        1,0,0,0,1951,1952,1,0,0,0,1952,1966,5,16,0,0,1953,1966,3,66,33,0,
        1954,1962,5,15,0,0,1955,1958,3,66,33,0,1956,1957,5,10,0,0,1957,1959,
        3,66,33,0,1958,1956,1,0,0,0,1959,1960,1,0,0,0,1960,1958,1,0,0,0,
        1960,1961,1,0,0,0,1961,1963,1,0,0,0,1962,1955,1,0,0,0,1962,1963,
        1,0,0,0,1963,1964,1,0,0,0,1964,1966,5,16,0,0,1965,1940,1,0,0,0,1965,
        1953,1,0,0,0,1965,1954,1,0,0,0,1966,139,1,0,0,0,1967,1972,3,138,
        69,0,1968,1969,5,10,0,0,1969,1971,3,138,69,0,1970,1968,1,0,0,0,1971,
        1974,1,0,0,0,1972,1970,1,0,0,0,1972,1973,1,0,0,0,1973,141,1,0,0,
        0,1974,1972,1,0,0,0,1975,1976,5,346,0,0,1976,1977,3,140,70,0,1977,
        143,1,0,0,0,1978,1981,3,78,39,0,1979,1981,3,74,37,0,1980,1978,1,
        0,0,0,1980,1979,1,0,0,0,1981,145,1,0,0,0,1982,1987,3,144,72,0,1983,
        1984,5,10,0,0,1984,1986,3,144,72,0,1985,1983,1,0,0,0,1986,1989,1,
        0,0,0,1987,1985,1,0,0,0,1987,1988,1,0,0,0,1988,147,1,0,0,0,1989,
        1987,1,0,0,0,1990,1991,5,269,0,0,1991,1992,3,146,73,0,1992,149,1,
        0,0,0,1993,1994,5,152,0,0,1994,1999,3,152,76,0,1995,1996,5,10,0,
        0,1996,1998,3,152,76,0,1997,1995,1,0,0,0,1998,2001,1,0,0,0,1999,
        1997,1,0,0,0,1999,2000,1,0,0,0,2000,151,1,0,0,0,2001,1999,1,0,0,
        0,2002,2003,6,76,-1,0,2003,2008,3,166,83,0,2004,2007,3,160,80,0,
        2005,2007,3,162,81,0,2006,2004,1,0,0,0,2006,2005,1,0,0,0,2007,2010,
        1,0,0,0,2008,2006,1,0,0,0,2008,2009,1,0,0,0,2009,2015,1,0,0,0,2010,
        2008,1,0,0,0,2011,2013,3,156,78,0,2012,2014,3,158,79,0,2013,2012,
        1,0,0,0,2013,2014,1,0,0,0,2014,2016,1,0,0,0,2015,2011,1,0,0,0,2015,
        2016,1,0,0,0,2016,2062,1,0,0,0,2017,2018,3,270,135,0,2018,2020,3,
        156,78,0,2019,2021,3,158,79,0,2020,2019,1,0,0,0,2020,2021,1,0,0,
        0,2021,2062,1,0,0,0,2022,2023,5,185,0,0,2023,2024,3,270,135,0,2024,
        2026,3,156,78,0,2025,2027,3,158,79,0,2026,2025,1,0,0,0,2026,2027,
        1,0,0,0,2027,2062,1,0,0,0,2028,2029,5,332,0,0,2029,2030,5,15,0,0,
        2030,2031,3,66,33,0,2031,2033,5,16,0,0,2032,2034,3,154,77,0,2033,
        2032,1,0,0,0,2033,2034,1,0,0,0,2034,2035,1,0,0,0,2035,2037,3,156,
        78,0,2036,2038,3,158,79,0,2037,2036,1,0,0,0,2037,2038,1,0,0,0,2038,
        2062,1,0,0,0,2039,2041,3,84,42,0,2040,2042,3,154,77,0,2041,2040,
        1,0,0,0,2041,2042,1,0,0,0,2042,2043,1,0,0,0,2043,2045,3,156,78,0,
        2044,2046,3,158,79,0,2045,2044,1,0,0,0,2045,2046,1,0,0,0,2046,2062,
        1,0,0,0,2047,2049,3,66,33,0,2048,2050,3,154,77,0,2049,2048,1,0,0,
        0,2049,2050,1,0,0,0,2050,2055,1,0,0,0,2051,2053,3,156,78,0,2052,
        2054,3,158,79,0,2053,2052,1,0,0,0,2053,2054,1,0,0,0,2054,2056,1,
        0,0,0,2055,2051,1,0,0,0,2055,2056,1,0,0,0,2056,2062,1,0,0,0,2057,
        2058,5,15,0,0,2058,2059,3,152,76,0,2059,2060,5,16,0,0,2060,2062,
        1,0,0,0,2061,2002,1,0,0,0,2061,2017,1,0,0,0,2061,2022,1,0,0,0,2061,
        2028,1,0,0,0,2061,2039,1,0,0,0,2061,2047,1,0,0,0,2061,2057,1,0,0,
        0,2062,2084,1,0,0,0,2063,2064,10,8,0,0,2064,2065,5,93,0,0,2065,2066,
        5,179,0,0,2066,2083,3,152,76,9,2067,2068,10,7,0,0,2068,2070,5,210,
        0,0,2069,2071,3,172,86,0,2070,2069,1,0,0,0,2070,2071,1,0,0,0,2071,
        2072,1,0,0,0,2072,2073,5,179,0,0,2073,2083,3,152,76,8,2074,2076,
        10,9,0,0,2075,2077,3,172,86,0,2076,2075,1,0,0,0,2076,2077,1,0,0,
        0,2077,2078,1,0,0,0,2078,2079,5,179,0,0,2079,2080,3,152,76,0,2080,
        2081,3,170,85,0,2081,2083,1,0,0,0,2082,2063,1,0,0,0,2082,2067,1,
        0,0,0,2082,2074,1,0,0,0,2083,2086,1,0,0,0,2084,2082,1,0,0,0,2084,
        2085,1,0,0,0,2085,153,1,0,0,0,2086,2084,1,0,0,0,2087,2088,5,358,
        0,0,2088,2089,5,234,0,0,2089,155,1,0,0,0,2090,2092,5,55,0,0,2091,
        2090,1,0,0,0,2091,2092,1,0,0,0,2092,2093,1,0,0,0,2093,2094,3,44,
        22,0,2094,157,1,0,0,0,2095,2096,5,15,0,0,2096,2097,3,168,84,0,2097,
        2098,5,16,0,0,2098,159,1,0,0,0,2099,2100,5,149,0,0,2100,2101,5,308,
        0,0,2101,2106,3,164,82,0,2102,2103,5,149,0,0,2103,2104,5,48,0,0,
        2104,2106,5,308,0,0,2105,2099,1,0,0,0,2105,2102,1,0,0,0,2106,161,
        1,0,0,0,2107,2108,5,149,0,0,2108,2109,5,345,0,0,2109,2122,3,164,
        82,0,2110,2111,5,149,0,0,2111,2112,5,345,0,0,2112,2113,5,231,0,0,
        2113,2114,5,152,0,0,2114,2115,3,66,33,0,2115,2116,5,321,0,0,2116,
        2117,3,66,33,0,2117,2122,1,0,0,0,2118,2119,5,149,0,0,2119,2120,5,
        48,0,0,2120,2122,5,345,0,0,2121,2107,1,0,0,0,2121,2110,1,0,0,0,2121,
        2118,1,0,0,0,2122,163,1,0,0,0,2123,2124,5,55,0,0,2124,2125,5,226,
        0,0,2125,2138,3,66,33,0,2126,2138,5,48,0,0,2127,2128,5,67,0,0,2128,
        2129,3,66,33,0,2129,2130,5,51,0,0,2130,2131,3,66,33,0,2131,2138,
        1,0,0,0,2132,2133,5,152,0,0,2133,2134,3,66,33,0,2134,2135,5,321,
        0,0,2135,2136,3,66,33,0,2136,2138,1,0,0,0,2137,2123,1,0,0,0,2137,
        2126,1,0,0,0,2137,2127,1,0,0,0,2137,2132,1,0,0,0,2138,165,1,0,0,
        0,2139,2140,3,44,22,0,2140,2141,5,11,0,0,2141,2143,1,0,0,0,2142,
        2139,1,0,0,0,2142,2143,1,0,0,0,2143,2144,1,0,0,0,2144,2145,3,44,
        22,0,2145,2146,5,11,0,0,2146,2148,1,0,0,0,2147,2142,1,0,0,0,2147,
        2148,1,0,0,0,2148,2149,1,0,0,0,2149,2150,3,44,22,0,2150,167,1,0,
        0,0,2151,2156,3,48,24,0,2152,2153,5,10,0,0,2153,2155,3,48,24,0,2154,
        2152,1,0,0,0,2155,2158,1,0,0,0,2156,2154,1,0,0,0,2156,2157,1,0,0,
        0,2157,169,1,0,0,0,2158,2156,1,0,0,0,2159,2160,5,230,0,0,2160,2167,
        3,66,33,0,2161,2162,5,343,0,0,2162,2163,5,15,0,0,2163,2164,3,168,
        84,0,2164,2165,5,16,0,0,2165,2167,1,0,0,0,2166,2159,1,0,0,0,2166,
        2161,1,0,0,0,2167,171,1,0,0,0,2168,2174,5,166,0,0,2169,2171,3,174,
        87,0,2170,2172,5,236,0,0,2171,2170,1,0,0,0,2171,2172,1,0,0,0,2172,
        2174,1,0,0,0,2173,2168,1,0,0,0,2173,2169,1,0,0,0,2174,173,1,0,0,
        0,2175,2176,7,31,0,0,2176,175,1,0,0,0,2177,2178,5,355,0,0,2178,2179,
        3,284,142,0,2179,177,1,0,0,0,2180,2181,5,156,0,0,2181,2183,5,75,
        0,0,2182,2184,3,296,148,0,2183,2182,1,0,0,0,2183,2184,1,0,0,0,2184,
        2185,1,0,0,0,2185,2190,3,180,90,0,2186,2187,5,10,0,0,2187,2189,3,
        180,90,0,2188,2186,1,0,0,0,2189,2192,1,0,0,0,2190,2188,1,0,0,0,2190,
        2191,1,0,0,0,2191,179,1,0,0,0,2192,2190,1,0,0,0,2193,2197,3,66,33,
        0,2194,2195,5,15,0,0,2195,2197,5,16,0,0,2196,2193,1,0,0,0,2196,2194,
        1,0,0,0,2197,181,1,0,0,0,2198,2199,5,161,0,0,2199,2200,3,284,142,
        0,2200,183,1,0,0,0,2201,2202,5,356,0,0,2202,2203,3,186,93,0,2203,
        185,1,0,0,0,2204,2209,3,188,94,0,2205,2206,5,10,0,0,2206,2208,3,
        188,94,0,2207,2205,1,0,0,0,2208,2211,1,0,0,0,2209,2207,1,0,0,0,2209,
        2210,1,0,0,0,2210,187,1,0,0,0,2211,2209,1,0,0,0,2212,2213,3,190,
        95,0,2213,2214,5,55,0,0,2214,2215,3,192,96,0,2215,189,1,0,0,0,2216,
        2217,3,44,22,0,2217,191,1,0,0,0,2218,2219,5,15,0,0,2219,2220,3,194,
        97,0,2220,2221,5,16,0,0,2221,193,1,0,0,0,2222,2224,3,44,22,0,2223,
        2222,1,0,0,0,2223,2224,1,0,0,0,2224,2226,1,0,0,0,2225,2227,3,196,
        98,0,2226,2225,1,0,0,0,2226,2227,1,0,0,0,2227,2229,1,0,0,0,2228,
        2230,3,200,100,0,2229,2228,1,0,0,0,2229,2230,1,0,0,0,2230,2232,1,
        0,0,0,2231,2233,3,202,101,0,2232,2231,1,0,0,0,2232,2233,1,0,0,0,
        2233,195,1,0,0,0,2234,2235,5,240,0,0,2235,2236,5,75,0,0,2236,2237,
        3,198,99,0,2237,197,1,0,0,0,2238,2243,3,82,41,0,2239,2240,5,10,0,
        0,2240,2242,3,82,41,0,2241,2239,1,0,0,0,2242,2245,1,0,0,0,2243,2241,
        1,0,0,0,2243,2244,1,0,0,0,2244,199,1,0,0,0,2245,2243,1,0,0,0,2246,
        2247,5,233,0,0,2247,2248,5,75,0,0,2248,2249,3,298,149,0,2249,201,
        1,0,0,0,2250,2251,3,204,102,0,2251,2253,3,206,103,0,2252,2254,3,
        218,109,0,2253,2252,1,0,0,0,2253,2254,1,0,0,0,2254,203,1,0,0,0,2255,
        2256,7,32,0,0,2256,205,1,0,0,0,2257,2260,3,208,104,0,2258,2260,3,
        212,106,0,2259,2257,1,0,0,0,2259,2258,1,0,0,0,2260,207,1,0,0,0,2261,
        2262,5,328,0,0,2262,2267,5,257,0,0,2263,2267,3,210,105,0,2264,2265,
        5,95,0,0,2265,2267,5,283,0,0,2266,2261,1,0,0,0,2266,2263,1,0,0,0,
        2266,2264,1,0,0,0,2267,209,1,0,0,0,2268,2269,5,5,0,0,2269,2270,5,
        257,0,0,2270,211,1,0,0,0,2271,2272,5,67,0,0,2272,2273,3,214,107,
        0,2273,2274,5,51,0,0,2274,2275,3,214,107,0,2275,213,1,0,0,0,2276,
        2281,3,208,104,0,2277,2278,5,328,0,0,2278,2281,5,148,0,0,2279,2281,
        3,216,108,0,2280,2276,1,0,0,0,2280,2277,1,0,0,0,2280,2279,1,0,0,
        0,2281,215,1,0,0,0,2282,2283,5,5,0,0,2283,2284,5,148,0,0,2284,217,
        1,0,0,0,2285,2286,5,134,0,0,2286,2287,5,95,0,0,2287,2296,5,283,0,
        0,2288,2289,5,134,0,0,2289,2296,5,156,0,0,2290,2291,5,134,0,0,2291,
        2296,5,314,0,0,2292,2293,5,134,0,0,2293,2294,5,214,0,0,2294,2296,
        5,235,0,0,2295,2285,1,0,0,0,2295,2288,1,0,0,0,2295,2290,1,0,0,0,
        2295,2292,1,0,0,0,2296,219,1,0,0,0,2297,2299,5,287,0,0,2298,2300,
        3,296,148,0,2299,2298,1,0,0,0,2299,2300,1,0,0,0,2300,2301,1,0,0,
        0,2301,2302,3,222,111,0,2302,221,1,0,0,0,2303,2310,3,224,112,0,2304,
        2306,5,10,0,0,2305,2307,3,226,113,0,2306,2305,1,0,0,0,2306,2307,
        1,0,0,0,2307,2309,1,0,0,0,2308,2304,1,0,0,0,2309,2312,1,0,0,0,2310,
        2308,1,0,0,0,2310,2311,1,0,0,0,2311,2330,1,0,0,0,2312,2310,1,0,0,
        0,2313,2315,3,226,113,0,2314,2313,1,0,0,0,2314,2315,1,0,0,0,2315,
        2322,1,0,0,0,2316,2318,5,10,0,0,2317,2319,3,226,113,0,2318,2317,
        1,0,0,0,2318,2319,1,0,0,0,2319,2321,1,0,0,0,2320,2316,1,0,0,0,2321,
        2324,1,0,0,0,2322,2320,1,0,0,0,2322,2323,1,0,0,0,2323,2327,1,0,0,
        0,2324,2322,1,0,0,0,2325,2326,5,10,0,0,2326,2328,3,224,112,0,2327,
        2325,1,0,0,0,2327,2328,1,0,0,0,2328,2330,1,0,0,0,2329,2303,1,0,0,
        0,2329,2314,1,0,0,0,2330,223,1,0,0,0,2331,2333,5,28,0,0,2332,2334,
        3,238,119,0,2333,2332,1,0,0,0,2333,2334,1,0,0,0,2334,2336,1,0,0,
        0,2335,2337,3,230,115,0,2336,2335,1,0,0,0,2336,2337,1,0,0,0,2337,
        225,1,0,0,0,2338,2341,3,240,120,0,2339,2341,3,228,114,0,2340,2338,
        1,0,0,0,2340,2339,1,0,0,0,2341,227,1,0,0,0,2342,2343,3,42,21,0,2343,
        2344,5,11,0,0,2344,2346,5,28,0,0,2345,2347,3,238,119,0,2346,2345,
        1,0,0,0,2346,2347,1,0,0,0,2347,2349,1,0,0,0,2348,2350,3,234,117,
        0,2349,2348,1,0,0,0,2349,2350,1,0,0,0,2350,229,1,0,0,0,2351,2352,
        5,274,0,0,2352,2366,3,232,116,0,2353,2354,5,274,0,0,2354,2355,5,
        15,0,0,2355,2360,3,232,116,0,2356,2357,5,10,0,0,2357,2359,3,232,
        116,0,2358,2356,1,0,0,0,2359,2362,1,0,0,0,2360,2358,1,0,0,0,2360,
        2361,1,0,0,0,2361,2363,1,0,0,0,2362,2360,1,0,0,0,2363,2364,5,16,
        0,0,2364,2366,1,0,0,0,2365,2351,1,0,0,0,2365,2353,1,0,0,0,2366,231,
        1,0,0,0,2367,2368,3,82,41,0,2368,2369,3,242,121,0,2369,233,1,0,0,
        0,2370,2371,5,274,0,0,2371,2385,3,236,118,0,2372,2373,5,274,0,0,
        2373,2374,5,15,0,0,2374,2379,3,236,118,0,2375,2376,5,10,0,0,2376,
        2378,3,236,118,0,2377,2375,1,0,0,0,2378,2381,1,0,0,0,2379,2377,1,
        0,0,0,2379,2380,1,0,0,0,2380,2382,1,0,0,0,2381,2379,1,0,0,0,2382,
        2383,5,16,0,0,2383,2385,1,0,0,0,2384,2370,1,0,0,0,2384,2372,1,0,
        0,0,2385,235,1,0,0,0,2386,2387,3,44,22,0,2387,2388,3,242,121,0,2388,
        237,1,0,0,0,2389,2390,5,134,0,0,2390,2404,3,44,22,0,2391,2392,5,
        134,0,0,2392,2393,5,15,0,0,2393,2398,3,44,22,0,2394,2395,5,10,0,
        0,2395,2397,3,44,22,0,2396,2394,1,0,0,0,2397,2400,1,0,0,0,2398,2396,
        1,0,0,0,2398,2399,1,0,0,0,2399,2401,1,0,0,0,2400,2398,1,0,0,0,2401,
        2402,5,16,0,0,2402,2404,1,0,0,0,2403,2389,1,0,0,0,2403,2391,1,0,
        0,0,2404,239,1,0,0,0,2405,2407,3,66,33,0,2406,2408,3,242,121,0,2407,
        2406,1,0,0,0,2407,2408,1,0,0,0,2408,241,1,0,0,0,2409,2412,5,55,0,
        0,2410,2413,3,50,25,0,2411,2413,5,113,0,0,2412,2410,1,0,0,0,2412,
        2411,1,0,0,0,2413,2416,1,0,0,0,2414,2416,3,50,25,0,2415,2409,1,0,
        0,0,2415,2414,1,0,0,0,2416,243,1,0,0,0,2417,2419,3,248,124,0,2418,
        2417,1,0,0,0,2418,2419,1,0,0,0,2419,2420,1,0,0,0,2420,2421,3,246,
        123,0,2421,245,1,0,0,0,2422,2424,3,252,126,0,2423,2425,3,258,129,
        0,2424,2423,1,0,0,0,2424,2425,1,0,0,0,2425,2427,1,0,0,0,2426,2428,
        3,260,130,0,2427,2426,1,0,0,0,2427,2428,1,0,0,0,2428,247,1,0,0,0,
        2429,2431,5,358,0,0,2430,2432,5,270,0,0,2431,2430,1,0,0,0,2431,2432,
        1,0,0,0,2432,2433,1,0,0,0,2433,2438,3,250,125,0,2434,2435,5,10,0,
        0,2435,2437,3,250,125,0,2436,2434,1,0,0,0,2437,2440,1,0,0,0,2438,
        2436,1,0,0,0,2438,2439,1,0,0,0,2439,249,1,0,0,0,2440,2438,1,0,0,
        0,2441,2443,5,199,0,0,2442,2441,1,0,0,0,2442,2443,1,0,0,0,2443,2444,
        1,0,0,0,2444,2449,3,44,22,0,2445,2446,5,15,0,0,2446,2447,3,168,84,
        0,2447,2448,5,16,0,0,2448,2450,1,0,0,0,2449,2445,1,0,0,0,2449,2450,
        1,0,0,0,2450,2451,1,0,0,0,2451,2452,5,55,0,0,2452,2453,3,270,135,
        0,2453,251,1,0,0,0,2454,2455,6,126,-1,0,2455,2457,3,220,110,0,2456,
        2458,3,150,75,0,2457,2456,1,0,0,0,2457,2458,1,0,0,0,2458,2460,1,
        0,0,0,2459,2461,3,176,88,0,2460,2459,1,0,0,0,2460,2461,1,0,0,0,2461,
        2463,1,0,0,0,2462,2464,3,178,89,0,2463,2462,1,0,0,0,2463,2464,1,
        0,0,0,2464,2466,1,0,0,0,2465,2467,3,182,91,0,2466,2465,1,0,0,0,2466,
        2467,1,0,0,0,2467,2469,1,0,0,0,2468,2470,3,184,92,0,2469,2468,1,
        0,0,0,2469,2470,1,0,0,0,2470,2497,1,0,0,0,2471,2475,3,150,75,0,2472,
        2474,3,256,128,0,2473,2472,1,0,0,0,2474,2477,1,0,0,0,2475,2473,1,
        0,0,0,2475,2476,1,0,0,0,2476,2479,1,0,0,0,2477,2475,1,0,0,0,2478,
        2480,3,184,92,0,2479,2478,1,0,0,0,2479,2480,1,0,0,0,2480,2497,1,
        0,0,0,2481,2497,3,142,71,0,2482,2497,3,148,74,0,2483,2484,5,15,0,
        0,2484,2485,3,246,123,0,2485,2486,5,16,0,0,2486,2497,1,0,0,0,2487,
        2494,5,361,0,0,2488,2495,3,32,16,0,2489,2490,5,15,0,0,2490,2491,
        3,32,16,0,2491,2492,3,254,127,0,2492,2493,5,16,0,0,2493,2495,1,0,
        0,0,2494,2488,1,0,0,0,2494,2489,1,0,0,0,2495,2497,1,0,0,0,2496,2454,
        1,0,0,0,2496,2471,1,0,0,0,2496,2481,1,0,0,0,2496,2482,1,0,0,0,2496,
        2483,1,0,0,0,2496,2487,1,0,0,0,2497,2512,1,0,0,0,2498,2499,10,2,
        0,0,2499,2501,5,173,0,0,2500,2502,7,33,0,0,2501,2500,1,0,0,0,2501,
        2502,1,0,0,0,2502,2503,1,0,0,0,2503,2511,3,252,126,3,2504,2505,10,
        1,0,0,2505,2507,7,34,0,0,2506,2508,7,33,0,0,2507,2506,1,0,0,0,2507,
        2508,1,0,0,0,2508,2509,1,0,0,0,2509,2511,3,252,126,2,2510,2498,1,
        0,0,0,2510,2504,1,0,0,0,2511,2514,1,0,0,0,2512,2510,1,0,0,0,2512,
        2513,1,0,0,0,2513,253,1,0,0,0,2514,2512,1,0,0,0,2515,2516,5,10,0,
        0,2516,2518,3,78,39,0,2517,2515,1,0,0,0,2518,2521,1,0,0,0,2519,2517,
        1,0,0,0,2519,2520,1,0,0,0,2520,255,1,0,0,0,2521,2519,1,0,0,0,2522,
        2531,3,176,88,0,2523,2525,3,178,89,0,2524,2523,1,0,0,0,2524,2525,
        1,0,0,0,2525,2527,1,0,0,0,2526,2528,3,182,91,0,2527,2526,1,0,0,0,
        2527,2528,1,0,0,0,2528,2529,1,0,0,0,2529,2531,3,220,110,0,2530,2522,
        1,0,0,0,2530,2524,1,0,0,0,2531,257,1,0,0,0,2532,2533,5,233,0,0,2533,
        2534,5,75,0,0,2534,2535,3,298,149,0,2535,259,1,0,0,0,2536,2538,3,
        262,131,0,2537,2539,3,264,132,0,2538,2537,1,0,0,0,2538,2539,1,0,
        0,0,2539,2545,1,0,0,0,2540,2542,3,264,132,0,2541,2543,3,262,131,
        0,2542,2541,1,0,0,0,2542,2543,1,0,0,0,2543,2545,1,0,0,0,2544,2536,
        1,0,0,0,2544,2540,1,0,0,0,2545,261,1,0,0,0,2546,2547,5,228,0,0,2547,
        2549,3,266,133,0,2548,2550,7,35,0,0,2549,2548,1,0,0,0,2549,2550,
        1,0,0,0,2550,263,1,0,0,0,2551,2552,5,140,0,0,2552,2554,7,36,0,0,
        2553,2555,3,268,134,0,2554,2553,1,0,0,0,2554,2555,1,0,0,0,2555,2556,
        1,0,0,0,2556,2557,7,35,0,0,2557,2561,5,231,0,0,2558,2559,5,194,0,
        0,2559,2561,3,268,134,0,2560,2551,1,0,0,0,2560,2558,1,0,0,0,2561,
        265,1,0,0,0,2562,2565,5,5,0,0,2563,2565,3,78,39,0,2564,2562,1,0,
        0,0,2564,2563,1,0,0,0,2565,267,1,0,0,0,2566,2569,5,5,0,0,2567,2569,
        3,78,39,0,2568,2566,1,0,0,0,2568,2567,1,0,0,0,2569,269,1,0,0,0,2570,
        2571,5,15,0,0,2571,2572,3,244,122,0,2572,2573,5,16,0,0,2573,271,
        1,0,0,0,2574,2575,3,276,138,0,2575,2576,3,66,33,0,2576,2631,1,0,
        0,0,2577,2579,5,216,0,0,2578,2577,1,0,0,0,2578,2579,1,0,0,0,2579,
        2580,1,0,0,0,2580,2582,5,67,0,0,2581,2583,7,12,0,0,2582,2581,1,0,
        0,0,2582,2583,1,0,0,0,2583,2584,1,0,0,0,2584,2585,3,68,34,0,2585,
        2586,5,51,0,0,2586,2587,3,68,34,0,2587,2631,1,0,0,0,2588,2590,5,
        216,0,0,2589,2588,1,0,0,0,2589,2590,1,0,0,0,2590,2591,1,0,0,0,2591,
        2592,5,165,0,0,2592,2631,3,278,139,0,2593,2595,5,216,0,0,2594,2593,
        1,0,0,0,2594,2595,1,0,0,0,2595,2596,1,0,0,0,2596,2597,7,13,0,0,2597,
        2600,3,68,34,0,2598,2599,5,131,0,0,2599,2601,3,68,34,0,2600,2598,
        1,0,0,0,2600,2601,1,0,0,0,2601,2631,1,0,0,0,2602,2604,5,216,0,0,
        2603,2602,1,0,0,0,2603,2604,1,0,0,0,2604,2605,1,0,0,0,2605,2606,
        5,193,0,0,2606,2609,3,68,34,0,2607,2608,5,144,0,0,2608,2610,3,68,
        34,0,2609,2607,1,0,0,0,2609,2610,1,0,0,0,2610,2631,1,0,0,0,2611,
        2612,3,280,140,0,2612,2613,3,68,34,0,2613,2631,1,0,0,0,2614,2616,
        5,176,0,0,2615,2617,5,216,0,0,2616,2615,1,0,0,0,2616,2617,1,0,0,
        0,2617,2618,1,0,0,0,2618,2631,5,220,0,0,2619,2621,5,176,0,0,2620,
        2622,5,216,0,0,2621,2620,1,0,0,0,2621,2622,1,0,0,0,2622,2623,1,0,
        0,0,2623,2624,5,119,0,0,2624,2625,5,152,0,0,2625,2631,3,66,33,0,
        2626,2627,3,276,138,0,2627,2628,3,282,141,0,2628,2629,3,274,137,
        0,2629,2631,1,0,0,0,2630,2574,1,0,0,0,2630,2578,1,0,0,0,2630,2589,
        1,0,0,0,2630,2594,1,0,0,0,2630,2603,1,0,0,0,2630,2611,1,0,0,0,2630,
        2614,1,0,0,0,2630,2619,1,0,0,0,2630,2626,1,0,0,0,2631,273,1,0,0,
        0,2632,2635,3,270,135,0,2633,2635,3,66,33,0,2634,2632,1,0,0,0,2634,
        2633,1,0,0,0,2635,275,1,0,0,0,2636,2637,7,37,0,0,2637,277,1,0,0,
        0,2638,2644,3,270,135,0,2639,2640,5,15,0,0,2640,2641,3,140,70,0,
        2641,2642,5,16,0,0,2642,2644,1,0,0,0,2643,2638,1,0,0,0,2643,2639,
        1,0,0,0,2644,279,1,0,0,0,2645,2646,7,38,0,0,2646,281,1,0,0,0,2647,
        2648,7,39,0,0,2648,283,1,0,0,0,2649,2651,3,66,33,0,2650,2649,1,0,
        0,0,2650,2651,1,0,0,0,2651,2658,1,0,0,0,2652,2654,5,10,0,0,2653,
        2655,3,66,33,0,2654,2653,1,0,0,0,2654,2655,1,0,0,0,2655,2657,1,0,
        0,0,2656,2652,1,0,0,0,2657,2660,1,0,0,0,2658,2656,1,0,0,0,2658,2659,
        1,0,0,0,2659,285,1,0,0,0,2660,2658,1,0,0,0,2661,2662,5,91,0,0,2662,
        2663,5,15,0,0,2663,2664,5,28,0,0,2664,2666,5,16,0,0,2665,2667,3,
        288,144,0,2666,2665,1,0,0,0,2666,2667,1,0,0,0,2667,2705,1,0,0,0,
        2668,2669,5,54,0,0,2669,2670,5,15,0,0,2670,2674,3,66,33,0,2671,2672,
        5,233,0,0,2672,2673,5,75,0,0,2673,2675,3,298,149,0,2674,2671,1,0,
        0,0,2674,2675,1,0,0,0,2675,2676,1,0,0,0,2676,2678,5,16,0,0,2677,
        2679,3,288,144,0,2678,2677,1,0,0,0,2678,2679,1,0,0,0,2679,2705,1,
        0,0,0,2680,2681,3,294,147,0,2681,2683,5,15,0,0,2682,2684,3,296,148,
        0,2683,2682,1,0,0,0,2683,2684,1,0,0,0,2684,2685,1,0,0,0,2685,2686,
        3,66,33,0,2686,2688,5,16,0,0,2687,2689,3,288,144,0,2688,2687,1,0,
        0,0,2688,2689,1,0,0,0,2689,2705,1,0,0,0,2690,2691,3,292,146,0,2691,
        2692,5,15,0,0,2692,2693,3,290,145,0,2693,2694,5,16,0,0,2694,2695,
        5,357,0,0,2695,2696,5,156,0,0,2696,2697,5,15,0,0,2697,2698,5,233,
        0,0,2698,2699,5,75,0,0,2699,2700,3,300,150,0,2700,2702,5,16,0,0,
        2701,2703,3,288,144,0,2702,2701,1,0,0,0,2702,2703,1,0,0,0,2703,2705,
        1,0,0,0,2704,2661,1,0,0,0,2704,2668,1,0,0,0,2704,2680,1,0,0,0,2704,
        2690,1,0,0,0,2705,287,1,0,0,0,2706,2707,5,141,0,0,2707,2708,5,15,
        0,0,2708,2709,5,355,0,0,2709,2710,3,66,33,0,2710,2711,5,16,0,0,2711,
        289,1,0,0,0,2712,2715,3,28,14,0,2713,2715,3,78,39,0,2714,2712,1,
        0,0,0,2714,2713,1,0,0,0,2715,291,1,0,0,0,2716,2717,7,40,0,0,2717,
        293,1,0,0,0,2718,2719,7,41,0,0,2719,295,1,0,0,0,2720,2721,7,33,0,
        0,2721,297,1,0,0,0,2722,2727,3,300,150,0,2723,2724,5,10,0,0,2724,
        2726,3,300,150,0,2725,2723,1,0,0,0,2726,2729,1,0,0,0,2727,2725,1,
        0,0,0,2727,2728,1,0,0,0,2728,299,1,0,0,0,2729,2727,1,0,0,0,2730,
        2732,3,66,33,0,2731,2733,3,302,151,0,2732,2731,1,0,0,0,2732,2733,
        1,0,0,0,2733,2735,1,0,0,0,2734,2736,3,304,152,0,2735,2734,1,0,0,
        0,2735,2736,1,0,0,0,2736,301,1,0,0,0,2737,2738,7,42,0,0,2738,303,
        1,0,0,0,2739,2740,5,222,0,0,2740,2744,5,142,0,0,2741,2742,5,222,
        0,0,2742,2744,5,183,0,0,2743,2739,1,0,0,0,2743,2741,1,0,0,0,2744,
        305,1,0,0,0,2745,2746,5,278,0,0,2746,2747,3,222,111,0,2747,307,1,
        0,0,0,2748,2751,5,149,0,0,2749,2750,5,254,0,0,2750,2752,5,226,0,
        0,2751,2749,1,0,0,0,2751,2752,1,0,0,0,2752,2753,1,0,0,0,2753,2754,
        5,345,0,0,2754,2755,5,152,0,0,2755,2758,3,80,40,0,2756,2757,5,321,
        0,0,2757,2759,3,80,40,0,2758,2756,1,0,0,0,2758,2759,1,0,0,0,2759,
        2768,1,0,0,0,2760,2765,5,149,0,0,2761,2762,5,48,0,0,2762,2766,5,
        345,0,0,2763,2764,5,345,0,0,2764,2766,5,48,0,0,2765,2761,1,0,0,0,
        2765,2763,1,0,0,0,2766,2768,1,0,0,0,2767,2748,1,0,0,0,2767,2760,
        1,0,0,0,2768,309,1,0,0,0,2769,2772,5,149,0,0,2770,2771,5,254,0,0,
        2771,2773,5,226,0,0,2772,2770,1,0,0,0,2772,2773,1,0,0,0,2773,2774,
        1,0,0,0,2774,2775,5,345,0,0,2775,2776,5,152,0,0,2776,2779,3,80,40,
        0,2777,2778,5,321,0,0,2778,2780,3,80,40,0,2779,2777,1,0,0,0,2779,
        2780,1,0,0,0,2780,311,1,0,0,0,2781,2782,3,148,74,0,2782,313,1,0,
        0,0,2783,2784,5,15,0,0,2784,2785,3,168,84,0,2785,2786,5,16,0,0,2786,
        2788,1,0,0,0,2787,2783,1,0,0,0,2787,2788,1,0,0,0,2788,2789,1,0,0,
        0,2789,2805,3,142,71,0,2790,2791,5,15,0,0,2791,2792,3,168,84,0,2792,
        2793,5,16,0,0,2793,2795,1,0,0,0,2794,2790,1,0,0,0,2794,2795,1,0,
        0,0,2795,2796,1,0,0,0,2796,2805,3,148,74,0,2797,2798,5,15,0,0,2798,
        2799,3,168,84,0,2799,2800,5,16,0,0,2800,2802,1,0,0,0,2801,2797,1,
        0,0,0,2801,2802,1,0,0,0,2802,2803,1,0,0,0,2803,2805,3,244,122,0,
        2804,2787,1,0,0,0,2804,2794,1,0,0,0,2804,2801,1,0,0,0,2805,315,1,
        0,0,0,2806,2811,3,318,159,0,2807,2808,5,10,0,0,2808,2810,3,318,159,
        0,2809,2807,1,0,0,0,2810,2813,1,0,0,0,2811,2809,1,0,0,0,2811,2812,
        1,0,0,0,2812,317,1,0,0,0,2813,2811,1,0,0,0,2814,2815,3,320,160,0,
        2815,2816,5,37,0,0,2816,2817,3,66,33,0,2817,319,1,0,0,0,2818,2819,
        3,48,24,0,2819,321,1,0,0,0,2820,2821,5,323,0,0,2821,2826,3,324,162,
        0,2822,2823,5,10,0,0,2823,2825,3,324,162,0,2824,2822,1,0,0,0,2825,
        2828,1,0,0,0,2826,2824,1,0,0,0,2826,2827,1,0,0,0,2827,323,1,0,0,
        0,2828,2826,1,0,0,0,2829,2830,5,177,0,0,2830,2831,5,190,0,0,2831,
        2837,3,350,175,0,2832,2833,5,266,0,0,2833,2837,5,231,0,0,2834,2835,
        5,266,0,0,2835,2837,5,360,0,0,2836,2829,1,0,0,0,2836,2832,1,0,0,
        0,2836,2834,1,0,0,0,2837,325,1,0,0,0,2838,2839,3,330,165,0,2839,
        2840,5,10,0,0,2840,2842,1,0,0,0,2841,2838,1,0,0,0,2842,2845,1,0,
        0,0,2843,2841,1,0,0,0,2843,2844,1,0,0,0,2844,2846,1,0,0,0,2845,2843,
        1,0,0,0,2846,2847,5,266,0,0,2847,2852,5,231,0,0,2848,2849,5,10,0,
        0,2849,2851,3,330,165,0,2850,2848,1,0,0,0,2851,2854,1,0,0,0,2852,
        2850,1,0,0,0,2852,2853,1,0,0,0,2853,2881,1,0,0,0,2854,2852,1,0,0,
        0,2855,2856,3,332,166,0,2856,2857,5,10,0,0,2857,2859,1,0,0,0,2858,
        2855,1,0,0,0,2859,2862,1,0,0,0,2860,2858,1,0,0,0,2860,2861,1,0,0,
        0,2861,2863,1,0,0,0,2862,2860,1,0,0,0,2863,2864,5,266,0,0,2864,2869,
        5,360,0,0,2865,2866,5,10,0,0,2866,2868,3,332,166,0,2867,2865,1,0,
        0,0,2868,2871,1,0,0,0,2869,2867,1,0,0,0,2869,2870,1,0,0,0,2870,2881,
        1,0,0,0,2871,2869,1,0,0,0,2872,2877,3,328,164,0,2873,2874,5,10,0,
        0,2874,2876,3,328,164,0,2875,2873,1,0,0,0,2876,2879,1,0,0,0,2877,
        2875,1,0,0,0,2877,2878,1,0,0,0,2878,2881,1,0,0,0,2879,2877,1,0,0,
        0,2880,2843,1,0,0,0,2880,2860,1,0,0,0,2880,2872,1,0,0,0,2881,327,
        1,0,0,0,2882,2883,5,177,0,0,2883,2884,5,190,0,0,2884,2887,3,350,
        175,0,2885,2887,3,344,172,0,2886,2882,1,0,0,0,2886,2885,1,0,0,0,
        2887,329,1,0,0,0,2888,2891,3,328,164,0,2889,2891,3,346,173,0,2890,
        2888,1,0,0,0,2890,2889,1,0,0,0,2891,331,1,0,0,0,2892,2895,3,328,
        164,0,2893,2895,3,348,174,0,2894,2892,1,0,0,0,2894,2893,1,0,0,0,
        2895,333,1,0,0,0,2896,2901,3,336,168,0,2897,2898,5,10,0,0,2898,2900,
        3,336,168,0,2899,2897,1,0,0,0,2900,2903,1,0,0,0,2901,2899,1,0,0,
        0,2901,2902,1,0,0,0,2902,335,1,0,0,0,2903,2901,1,0,0,0,2904,2905,
        5,177,0,0,2905,2906,5,190,0,0,2906,2942,3,350,175,0,2907,2908,5,
        266,0,0,2908,2909,5,231,0,0,2909,2910,5,358,0,0,2910,2912,5,15,0,
        0,2911,2913,3,338,169,0,2912,2911,1,0,0,0,2912,2913,1,0,0,0,2913,
        2920,1,0,0,0,2914,2916,5,10,0,0,2915,2917,3,338,169,0,2916,2915,
        1,0,0,0,2916,2917,1,0,0,0,2917,2919,1,0,0,0,2918,2914,1,0,0,0,2919,
        2922,1,0,0,0,2920,2918,1,0,0,0,2920,2921,1,0,0,0,2921,2923,1,0,0,
        0,2922,2920,1,0,0,0,2923,2942,5,16,0,0,2924,2925,5,266,0,0,2925,
        2926,5,360,0,0,2926,2927,5,358,0,0,2927,2929,5,15,0,0,2928,2930,
        3,340,170,0,2929,2928,1,0,0,0,2929,2930,1,0,0,0,2930,2937,1,0,0,
        0,2931,2933,5,10,0,0,2932,2934,3,340,170,0,2933,2932,1,0,0,0,2933,
        2934,1,0,0,0,2934,2936,1,0,0,0,2935,2931,1,0,0,0,2936,2939,1,0,0,
        0,2937,2935,1,0,0,0,2937,2938,1,0,0,0,2938,2940,1,0,0,0,2939,2937,
        1,0,0,0,2940,2942,5,16,0,0,2941,2904,1,0,0,0,2941,2907,1,0,0,0,2941,
        2924,1,0,0,0,2942,337,1,0,0,0,2943,2946,3,346,173,0,2944,2946,3,
        344,172,0,2945,2943,1,0,0,0,2945,2944,1,0,0,0,2946,339,1,0,0,0,2947,
        2950,3,348,174,0,2948,2950,3,344,172,0,2949,2947,1,0,0,0,2949,2948,
        1,0,0,0,2950,341,1,0,0,0,2951,2954,3,66,33,0,2952,2954,5,113,0,0,
        2953,2951,1,0,0,0,2953,2952,1,0,0,0,2954,343,1,0,0,0,2955,2959,5,
        318,0,0,2956,2957,5,315,0,0,2957,2959,5,363,0,0,2958,2955,1,0,0,
        0,2958,2956,1,0,0,0,2959,2961,1,0,0,0,2960,2962,5,37,0,0,2961,2960,
        1,0,0,0,2961,2962,1,0,0,0,2962,2963,1,0,0,0,2963,2964,3,342,171,
        0,2964,345,1,0,0,0,2965,2967,5,296,0,0,2966,2968,5,37,0,0,2967,2966,
        1,0,0,0,2967,2968,1,0,0,0,2968,2969,1,0,0,0,2969,2986,3,342,171,
        0,2970,2972,5,295,0,0,2971,2973,5,37,0,0,2972,2971,1,0,0,0,2972,
        2973,1,0,0,0,2973,2974,1,0,0,0,2974,2986,3,342,171,0,2975,2977,5,
        85,0,0,2976,2978,5,37,0,0,2977,2976,1,0,0,0,2977,2978,1,0,0,0,2978,
        2979,1,0,0,0,2979,2986,3,342,171,0,2980,2982,5,63,0,0,2981,2983,
        5,37,0,0,2982,2981,1,0,0,0,2982,2983,1,0,0,0,2983,2984,1,0,0,0,2984,
        2986,3,342,171,0,2985,2965,1,0,0,0,2985,2970,1,0,0,0,2985,2975,1,
        0,0,0,2985,2980,1,0,0,0,2986,347,1,0,0,0,2987,2989,5,308,0,0,2988,
        2990,5,37,0,0,2989,2988,1,0,0,0,2989,2990,1,0,0,0,2990,2991,1,0,
        0,0,2991,3006,3,342,171,0,2992,2994,5,59,0,0,2993,2995,5,37,0,0,
        2994,2993,1,0,0,0,2994,2995,1,0,0,0,2995,2998,1,0,0,0,2996,2999,
        3,28,14,0,2997,2999,5,113,0,0,2998,2996,1,0,0,0,2998,2997,1,0,0,
        0,2999,3006,1,0,0,0,3000,3002,5,201,0,0,3001,3003,5,37,0,0,3002,
        3001,1,0,0,0,3002,3003,1,0,0,0,3003,3004,1,0,0,0,3004,3006,3,342,
        171,0,3005,2987,1,0,0,0,3005,2992,1,0,0,0,3005,3000,1,0,0,0,3006,
        349,1,0,0,0,3007,3008,5,266,0,0,3008,3015,5,329,0,0,3009,3010,5,
        266,0,0,3010,3015,5,88,0,0,3011,3012,5,275,0,0,3012,3015,5,266,0,
        0,3013,3015,5,289,0,0,3014,3007,1,0,0,0,3014,3009,1,0,0,0,3014,3011,
        1,0,0,0,3014,3013,1,0,0,0,3015,351,1,0,0,0,372,354,363,367,373,375,
        378,386,391,394,397,403,406,412,415,418,422,425,431,439,442,446,
        452,473,475,479,486,498,507,511,516,525,546,564,572,574,580,585,
        595,600,605,609,613,620,630,632,640,646,652,664,668,672,678,681,
        684,689,709,714,720,723,730,742,744,751,756,759,848,854,862,866,
        874,879,882,891,894,901,904,909,917,926,939,947,952,955,957,970,
        976,978,988,992,1001,1071,1084,1090,1096,1100,1106,1120,1126,1129,
        1131,1164,1167,1175,1178,1196,1216,1223,1233,1240,1250,1257,1267,
        1275,1285,1299,1315,1329,1338,1341,1349,1353,1356,1360,1366,1368,
        1375,1384,1432,1436,1460,1462,1466,1473,1479,1484,1489,1499,1504,
        1509,1518,1522,1527,1534,1539,1549,1574,1581,1590,1601,1612,1623,
        1634,1659,1661,1667,1672,1675,1680,1685,1692,1694,1705,1708,1717,
        1720,1723,1731,1735,1742,1751,1775,1777,1781,1788,1797,1800,1802,
        1808,1814,1824,1828,1842,1846,1852,1858,1882,1887,1892,1896,1919,
        1922,1930,1933,1938,1947,1950,1960,1962,1965,1972,1980,1987,1999,
        2006,2008,2013,2015,2020,2026,2033,2037,2041,2045,2049,2053,2055,
        2061,2070,2076,2082,2084,2091,2105,2121,2137,2142,2147,2156,2166,
        2171,2173,2183,2190,2196,2209,2223,2226,2229,2232,2243,2253,2259,
        2266,2280,2295,2299,2306,2310,2314,2318,2322,2327,2329,2333,2336,
        2340,2346,2349,2360,2365,2379,2384,2398,2403,2407,2412,2415,2418,
        2424,2427,2431,2438,2442,2449,2457,2460,2463,2466,2469,2475,2479,
        2494,2496,2501,2507,2510,2512,2519,2524,2527,2530,2538,2542,2544,
        2549,2554,2560,2564,2568,2578,2582,2589,2594,2600,2603,2609,2616,
        2621,2630,2634,2643,2650,2654,2658,2666,2674,2678,2683,2688,2702,
        2704,2714,2727,2732,2735,2743,2751,2758,2765,2767,2772,2779,2787,
        2794,2801,2804,2811,2826,2836,2843,2852,2860,2869,2877,2880,2886,
        2890,2894,2901,2912,2916,2920,2929,2933,2937,2941,2945,2949,2953,
        2958,2961,2967,2972,2977,2982,2985,2989,2994,2998,3002,3005,3014
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!Sql.__ATN) {
            Sql.__ATN = new antlr.ATNDeserializer().deserialize(Sql._serializedATN);
        }

        return Sql.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(Sql.literalNames, Sql.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return Sql.vocabulary;
    }

    private static readonly decisionsToDFA = Sql._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class DirectSqlStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public directlyExecutableStatement(): DirectlyExecutableStatementContext {
        return this.getRuleContext(0, DirectlyExecutableStatementContext)!;
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(Sql.EOF, 0)!;
    }
    public SEMI(): antlr.TerminalNode | null {
        return this.getToken(Sql.SEMI, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_directSqlStatement;
    }
}


export class MultiSqlStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public directlyExecutableStatement(): DirectlyExecutableStatementContext[];
    public directlyExecutableStatement(i: number): DirectlyExecutableStatementContext | null;
    public directlyExecutableStatement(i?: number): DirectlyExecutableStatementContext[] | DirectlyExecutableStatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(DirectlyExecutableStatementContext);
        }

        return this.getRuleContext(i, DirectlyExecutableStatementContext);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(Sql.EOF, 0)!;
    }
    public SEMI(): antlr.TerminalNode[];
    public SEMI(i: number): antlr.TerminalNode | null;
    public SEMI(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.SEMI);
    	} else {
    		return this.getToken(Sql.SEMI, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_multiSqlStatement;
    }
}


export class DirectlyExecutableStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_directlyExecutableStatement;
    }
    public override copyFrom(ctx: DirectlyExecutableStatementContext): void {
        super.copyFrom(ctx);
    }
}
export class SetSessionVariableStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SET(): antlr.TerminalNode {
        return this.getToken(Sql.SET, 0)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public literal(): LiteralContext {
        return this.getRuleContext(0, LiteralContext)!;
    }
    public TO(): antlr.TerminalNode | null {
        return this.getToken(Sql.TO, 0);
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
    public SESSION(): antlr.TerminalNode | null {
        return this.getToken(Sql.SESSION, 0);
    }
}
export class CopyInStmtContext extends DirectlyExecutableStatementContext {
    public _opts?: CopyOptsContext;
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public COPY(): antlr.TerminalNode {
        return this.getToken(Sql.COPY, 0)!;
    }
    public targetTable(): TargetTableContext {
        return this.getRuleContext(0, TargetTableContext)!;
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public STDIN(): antlr.TerminalNode {
        return this.getToken(Sql.STDIN, 0)!;
    }
    public copyOpts(): CopyOptsContext {
        return this.getRuleContext(0, CopyOptsContext)!;
    }
}
export class PatchStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public PATCH(): antlr.TerminalNode {
        return this.getToken(Sql.PATCH, 0)!;
    }
    public INTO(): antlr.TerminalNode {
        return this.getToken(Sql.INTO, 0)!;
    }
    public targetTable(): TargetTableContext {
        return this.getRuleContext(0, TargetTableContext)!;
    }
    public patchSource(): PatchSourceContext {
        return this.getRuleContext(0, PatchSourceContext)!;
    }
    public patchStatementValidTimeExtents(): PatchStatementValidTimeExtentsContext | null {
        return this.getRuleContext(0, PatchStatementValidTimeExtentsContext);
    }
}
export class RollbackStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ROLLBACK(): antlr.TerminalNode {
        return this.getToken(Sql.ROLLBACK, 0)!;
    }
}
export class QueryExprContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public queryExpression(): QueryExpressionContext {
        return this.getRuleContext(0, QueryExpressionContext)!;
    }
    public EXPLAIN(): antlr.TerminalNode | null {
        return this.getToken(Sql.EXPLAIN, 0);
    }
    public settingQueryVariables(): SettingQueryVariablesContext | null {
        return this.getRuleContext(0, SettingQueryVariablesContext);
    }
    public ANALYZE(): antlr.TerminalNode | null {
        return this.getToken(Sql.ANALYZE, 0);
    }
}
export class EraseStatementContext extends DirectlyExecutableStatementContext {
    public _correlationName?: IdentifierContext;
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ERASE(): antlr.TerminalNode {
        return this.getToken(Sql.ERASE, 0)!;
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public targetTable(): TargetTableContext {
        return this.getRuleContext(0, TargetTableContext)!;
    }
    public WHERE(): antlr.TerminalNode | null {
        return this.getToken(Sql.WHERE, 0);
    }
    public searchCondition(): SearchConditionContext | null {
        return this.getRuleContext(0, SearchConditionContext);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public AS(): antlr.TerminalNode | null {
        return this.getToken(Sql.AS, 0);
    }
}
export class SetAwaitTokenStatementContext extends DirectlyExecutableStatementContext {
    public _awaitToken?: ExprContext;
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SET(): antlr.TerminalNode {
        return this.getToken(Sql.SET, 0)!;
    }
    public AWAIT_TOKEN(): antlr.TerminalNode {
        return this.getToken(Sql.AWAIT_TOKEN, 0)!;
    }
    public TO(): antlr.TerminalNode | null {
        return this.getToken(Sql.TO, 0);
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class DeleteStatementContext extends DirectlyExecutableStatementContext {
    public _correlationName?: IdentifierContext;
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DELETE(): antlr.TerminalNode {
        return this.getToken(Sql.DELETE, 0)!;
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public targetTable(): TargetTableContext {
        return this.getRuleContext(0, TargetTableContext)!;
    }
    public dmlStatementValidTimeExtents(): DmlStatementValidTimeExtentsContext | null {
        return this.getRuleContext(0, DmlStatementValidTimeExtentsContext);
    }
    public WHERE(): antlr.TerminalNode | null {
        return this.getToken(Sql.WHERE, 0);
    }
    public searchCondition(): SearchConditionContext | null {
        return this.getRuleContext(0, SearchConditionContext);
    }
    public returningStatement(): ReturningStatementContext | null {
        return this.getRuleContext(0, ReturningStatementContext);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public AS(): antlr.TerminalNode | null {
        return this.getToken(Sql.AS, 0);
    }
}
export class InsertStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public INSERT(): antlr.TerminalNode {
        return this.getToken(Sql.INSERT, 0)!;
    }
    public INTO(): antlr.TerminalNode {
        return this.getToken(Sql.INTO, 0)!;
    }
    public targetTable(): TargetTableContext {
        return this.getRuleContext(0, TargetTableContext)!;
    }
    public insertColumnsAndSource(): InsertColumnsAndSourceContext {
        return this.getRuleContext(0, InsertColumnsAndSourceContext)!;
    }
    public returningStatement(): ReturningStatementContext | null {
        return this.getRuleContext(0, ReturningStatementContext);
    }
}
export class SetRoleStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SET(): antlr.TerminalNode {
        return this.getToken(Sql.SET, 0)!;
    }
    public ROLE(): antlr.TerminalNode {
        return this.getToken(Sql.ROLE, 0)!;
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public NONE(): antlr.TerminalNode | null {
        return this.getToken(Sql.NONE, 0);
    }
}
export class SetSessionCharacteristicsStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SET(): antlr.TerminalNode {
        return this.getToken(Sql.SET, 0)!;
    }
    public SESSION(): antlr.TerminalNode {
        return this.getToken(Sql.SESSION, 0)!;
    }
    public CHARACTERISTICS(): antlr.TerminalNode {
        return this.getToken(Sql.CHARACTERISTICS, 0)!;
    }
    public AS(): antlr.TerminalNode {
        return this.getToken(Sql.AS, 0)!;
    }
    public sessionCharacteristic(): SessionCharacteristicContext[];
    public sessionCharacteristic(i: number): SessionCharacteristicContext | null;
    public sessionCharacteristic(i?: number): SessionCharacteristicContext[] | SessionCharacteristicContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SessionCharacteristicContext);
        }

        return this.getRuleContext(i, SessionCharacteristicContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}
export class ShowClockTimeStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SHOW(): antlr.TerminalNode {
        return this.getToken(Sql.SHOW, 0)!;
    }
    public CLOCK_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.CLOCK_TIME, 0)!;
    }
}
export class ExecuteStatementContext extends DirectlyExecutableStatementContext {
    public _statementName?: IdentifierContext;
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public EXECUTE(): antlr.TerminalNode {
        return this.getToken(Sql.EXECUTE, 0)!;
    }
    public executeArgs(): ExecuteArgsContext {
        return this.getRuleContext(0, ExecuteArgsContext)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
}
export class RevokeRoleStatementContext extends DirectlyExecutableStatementContext {
    public _roleName?: IdentifierContext;
    public _userName?: IdentifierContext;
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public REVOKE(): antlr.TerminalNode {
        return this.getToken(Sql.REVOKE, 0)!;
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
    }
}
export class ShowSnapshotTokenStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SHOW(): antlr.TerminalNode {
        return this.getToken(Sql.SHOW, 0)!;
    }
    public SNAPSHOT_TOKEN(): antlr.TerminalNode {
        return this.getToken(Sql.SNAPSHOT_TOKEN, 0)!;
    }
}
export class CommitStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public COMMIT(): antlr.TerminalNode {
        return this.getToken(Sql.COMMIT, 0)!;
    }
    public SYNC(): antlr.TerminalNode | null {
        return this.getToken(Sql.SYNC, 0);
    }
    public ASYNC(): antlr.TerminalNode | null {
        return this.getToken(Sql.ASYNC, 0);
    }
}
export class DiscardStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DISCARD(): antlr.TerminalNode {
        return this.getToken(Sql.DISCARD, 0)!;
    }
    public discardTarget(): DiscardTargetContext {
        return this.getRuleContext(0, DiscardTargetContext)!;
    }
}
export class StartTransactionStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public START(): antlr.TerminalNode | null {
        return this.getToken(Sql.START, 0);
    }
    public TRANSACTION(): antlr.TerminalNode | null {
        return this.getToken(Sql.TRANSACTION, 0);
    }
    public BEGIN(): antlr.TerminalNode | null {
        return this.getToken(Sql.BEGIN, 0);
    }
    public transactionCharacteristics(): TransactionCharacteristicsContext | null {
        return this.getRuleContext(0, TransactionCharacteristicsContext);
    }
    public beginWithCharacteristics(): BeginWithCharacteristicsContext | null {
        return this.getRuleContext(0, BeginWithCharacteristicsContext);
    }
}
export class PrepareStatementContext extends DirectlyExecutableStatementContext {
    public _statementName?: IdentifierContext;
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public PREPARE(): antlr.TerminalNode {
        return this.getToken(Sql.PREPARE, 0)!;
    }
    public AS(): antlr.TerminalNode {
        return this.getToken(Sql.AS, 0)!;
    }
    public directlyExecutableStatement(): DirectlyExecutableStatementContext {
        return this.getRuleContext(0, DirectlyExecutableStatementContext)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
}
export class ShowAwaitTokenStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SHOW(): antlr.TerminalNode {
        return this.getToken(Sql.SHOW, 0)!;
    }
    public AWAIT_TOKEN(): antlr.TerminalNode {
        return this.getToken(Sql.AWAIT_TOKEN, 0)!;
    }
}
export class UpdateStatementContext extends DirectlyExecutableStatementContext {
    public _correlationName?: IdentifierContext;
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public UPDATE(): antlr.TerminalNode {
        return this.getToken(Sql.UPDATE, 0)!;
    }
    public targetTable(): TargetTableContext {
        return this.getRuleContext(0, TargetTableContext)!;
    }
    public SET(): antlr.TerminalNode {
        return this.getToken(Sql.SET, 0)!;
    }
    public setClauseList(): SetClauseListContext {
        return this.getRuleContext(0, SetClauseListContext)!;
    }
    public dmlStatementValidTimeExtents(): DmlStatementValidTimeExtentsContext | null {
        return this.getRuleContext(0, DmlStatementValidTimeExtentsContext);
    }
    public WHERE(): antlr.TerminalNode | null {
        return this.getToken(Sql.WHERE, 0);
    }
    public searchCondition(): SearchConditionContext | null {
        return this.getRuleContext(0, SearchConditionContext);
    }
    public returningStatement(): ReturningStatementContext | null {
        return this.getRuleContext(0, ReturningStatementContext);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public AS(): antlr.TerminalNode | null {
        return this.getToken(Sql.AS, 0);
    }
}
export class SetTransactionStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SET(): antlr.TerminalNode {
        return this.getToken(Sql.SET, 0)!;
    }
    public TRANSACTION(): antlr.TerminalNode {
        return this.getToken(Sql.TRANSACTION, 0)!;
    }
    public transactionCharacteristics(): TransactionCharacteristicsContext {
        return this.getRuleContext(0, TransactionCharacteristicsContext)!;
    }
}
export class AttachDatabaseStatementContext extends DirectlyExecutableStatementContext {
    public _dbName?: IdentifierContext;
    public _configYaml?: CharacterStringContext;
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ATTACH(): antlr.TerminalNode {
        return this.getToken(Sql.ATTACH, 0)!;
    }
    public DATABASE(): antlr.TerminalNode {
        return this.getToken(Sql.DATABASE, 0)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public WITH(): antlr.TerminalNode | null {
        return this.getToken(Sql.WITH, 0);
    }
    public characterString(): CharacterStringContext | null {
        return this.getRuleContext(0, CharacterStringContext);
    }
}
export class CreateTableStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CREATE(): antlr.TerminalNode {
        return this.getToken(Sql.CREATE, 0)!;
    }
    public TABLE(): antlr.TerminalNode {
        return this.getToken(Sql.TABLE, 0)!;
    }
    public targetTable(): TargetTableContext {
        return this.getRuleContext(0, TargetTableContext)!;
    }
    public OR(): antlr.TerminalNode | null {
        return this.getToken(Sql.OR, 0);
    }
    public ALTER(): antlr.TerminalNode | null {
        return this.getToken(Sql.ALTER, 0);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public columnNameList(): ColumnNameListContext | null {
        return this.getRuleContext(0, ColumnNameListContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class DetachDatabaseStatementContext extends DirectlyExecutableStatementContext {
    public _dbName?: IdentifierContext;
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DETACH(): antlr.TerminalNode {
        return this.getToken(Sql.DETACH, 0)!;
    }
    public DATABASE(): antlr.TerminalNode {
        return this.getToken(Sql.DATABASE, 0)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
}
export class ShowSessionVariableStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SHOW(): antlr.TerminalNode {
        return this.getToken(Sql.SHOW, 0)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
}
export class SetTimeZoneStatementContext extends DirectlyExecutableStatementContext {
    public _zone?: ExprContext;
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SET(): antlr.TerminalNode {
        return this.getToken(Sql.SET, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public TIME(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIME, 0);
    }
    public ZONE(): antlr.TerminalNode | null {
        return this.getToken(Sql.ZONE, 0);
    }
    public TIMEZONE(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIMEZONE, 0);
    }
    public SESSION(): antlr.TerminalNode | null {
        return this.getToken(Sql.SESSION, 0);
    }
}
export class AssertStatementContext extends DirectlyExecutableStatementContext {
    public _condition?: ExprContext;
    public _message?: CharacterStringContext;
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ASSERT(): antlr.TerminalNode {
        return this.getToken(Sql.ASSERT, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public COMMA(): antlr.TerminalNode | null {
        return this.getToken(Sql.COMMA, 0);
    }
    public characterString(): CharacterStringContext | null {
        return this.getRuleContext(0, CharacterStringContext);
    }
}
export class ShowVariableStatementContext extends DirectlyExecutableStatementContext {
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SHOW(): antlr.TerminalNode {
        return this.getToken(Sql.SHOW, 0)!;
    }
    public showVariable(): ShowVariableContext {
        return this.getRuleContext(0, ShowVariableContext)!;
    }
}
export class GrantRoleStatementContext extends DirectlyExecutableStatementContext {
    public _roleName?: IdentifierContext;
    public _userName?: IdentifierContext;
    public constructor(ctx: DirectlyExecutableStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public GRANT(): antlr.TerminalNode {
        return this.getToken(Sql.GRANT, 0)!;
    }
    public TO(): antlr.TerminalNode {
        return this.getToken(Sql.TO, 0)!;
    }
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
    }
}


export class DiscardTargetContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_discardTarget;
    }
    public override copyFrom(ctx: DiscardTargetContext): void {
        super.copyFrom(ctx);
    }
}
export class DiscardPlansContext extends DiscardTargetContext {
    public constructor(ctx: DiscardTargetContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public PLANS(): antlr.TerminalNode {
        return this.getToken(Sql.PLANS, 0)!;
    }
}
export class DiscardSequencesContext extends DiscardTargetContext {
    public constructor(ctx: DiscardTargetContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SEQUENCES(): antlr.TerminalNode {
        return this.getToken(Sql.SEQUENCES, 0)!;
    }
}
export class DiscardTempContext extends DiscardTargetContext {
    public constructor(ctx: DiscardTargetContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TEMP(): antlr.TerminalNode | null {
        return this.getToken(Sql.TEMP, 0);
    }
    public TEMPORARY(): antlr.TerminalNode | null {
        return this.getToken(Sql.TEMPORARY, 0);
    }
}
export class DiscardAllContext extends DiscardTargetContext {
    public constructor(ctx: DiscardTargetContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ALL(): antlr.TerminalNode {
        return this.getToken(Sql.ALL, 0)!;
    }
}


export class TargetTableContext extends antlr.ParserRuleContext {
    public _schemaName?: IdentifierContext;
    public _tableName?: IdentifierContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_targetTable;
    }
}


export class ExecuteArgsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_executeArgs;
    }
}


export class CopyOptsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WITH(): antlr.TerminalNode {
        return this.getToken(Sql.WITH, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public copyOpt(): CopyOptContext[];
    public copyOpt(i: number): CopyOptContext | null;
    public copyOpt(i?: number): CopyOptContext[] | CopyOptContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CopyOptContext);
        }

        return this.getRuleContext(i, CopyOptContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_copyOpts;
    }
}


export class CopyOptContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_copyOpt;
    }
    public override copyFrom(ctx: CopyOptContext): void {
        super.copyFrom(ctx);
    }
}
export class CopyFormatOptionContext extends CopyOptContext {
    public _format?: CharacterStringContext;
    public constructor(ctx: CopyOptContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public FORMAT(): antlr.TerminalNode {
        return this.getToken(Sql.FORMAT, 0)!;
    }
    public characterString(): CharacterStringContext {
        return this.getRuleContext(0, CharacterStringContext)!;
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
}


export class ShowVariableContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_showVariable;
    }
    public override copyFrom(ctx: ShowVariableContext): void {
        super.copyFrom(ctx);
    }
}
export class ShowTimeZoneContext extends ShowVariableContext {
    public constructor(ctx: ShowVariableContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TIME(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIME, 0);
    }
    public ZONE(): antlr.TerminalNode | null {
        return this.getToken(Sql.ZONE, 0);
    }
    public TIMEZONE(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIMEZONE, 0);
    }
}
export class ShowTransactionIsolationLevelContext extends ShowVariableContext {
    public constructor(ctx: ShowVariableContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TRANSACTION(): antlr.TerminalNode {
        return this.getToken(Sql.TRANSACTION, 0)!;
    }
    public ISOLATION(): antlr.TerminalNode {
        return this.getToken(Sql.ISOLATION, 0)!;
    }
    public LEVEL(): antlr.TerminalNode {
        return this.getToken(Sql.LEVEL, 0)!;
    }
}


export class SettingQueryVariablesContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public SETTING(): antlr.TerminalNode {
        return this.getToken(Sql.SETTING, 0)!;
    }
    public settingQueryVariable(): SettingQueryVariableContext[];
    public settingQueryVariable(i: number): SettingQueryVariableContext | null;
    public settingQueryVariable(i?: number): SettingQueryVariableContext[] | SettingQueryVariableContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SettingQueryVariableContext);
        }

        return this.getRuleContext(i, SettingQueryVariableContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_settingQueryVariables;
    }
}


export class SettingQueryVariableContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_settingQueryVariable;
    }
    public override copyFrom(ctx: SettingQueryVariableContext): void {
        super.copyFrom(ctx);
    }
}
export class SettingDefaultSystemTimeContext extends SettingQueryVariableContext {
    public constructor(ctx: SettingQueryVariableContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DEFAULT(): antlr.TerminalNode {
        return this.getToken(Sql.DEFAULT, 0)!;
    }
    public SYSTEM_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.SYSTEM_TIME, 0)!;
    }
    public tableTimePeriodSpecification(): TableTimePeriodSpecificationContext {
        return this.getRuleContext(0, TableTimePeriodSpecificationContext)!;
    }
    public TO(): antlr.TerminalNode | null {
        return this.getToken(Sql.TO, 0);
    }
}
export class SettingSnapshotTokenContext extends SettingQueryVariableContext {
    public _snapshotToken?: ExprContext;
    public constructor(ctx: SettingQueryVariableContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SNAPSHOT_TOKEN(): antlr.TerminalNode {
        return this.getToken(Sql.SNAPSHOT_TOKEN, 0)!;
    }
    public TO(): antlr.TerminalNode | null {
        return this.getToken(Sql.TO, 0);
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class SettingSnapshotTimeContext extends SettingQueryVariableContext {
    public _snapshotTime?: ExprContext;
    public constructor(ctx: SettingQueryVariableContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SNAPSHOT_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.SNAPSHOT_TIME, 0)!;
    }
    public TO(): antlr.TerminalNode | null {
        return this.getToken(Sql.TO, 0);
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class SettingClockTimeContext extends SettingQueryVariableContext {
    public _clockTime?: ExprContext;
    public constructor(ctx: SettingQueryVariableContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CLOCK_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.CLOCK_TIME, 0)!;
    }
    public TO(): antlr.TerminalNode | null {
        return this.getToken(Sql.TO, 0);
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class SettingDefaultValidTimeContext extends SettingQueryVariableContext {
    public constructor(ctx: SettingQueryVariableContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DEFAULT(): antlr.TerminalNode {
        return this.getToken(Sql.DEFAULT, 0)!;
    }
    public VALID_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.VALID_TIME, 0)!;
    }
    public tableTimePeriodSpecification(): TableTimePeriodSpecificationContext {
        return this.getRuleContext(0, TableTimePeriodSpecificationContext)!;
    }
    public TO(): antlr.TerminalNode | null {
        return this.getToken(Sql.TO, 0);
    }
}


export class IntervalLiteralContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INTERVAL(): antlr.TerminalNode {
        return this.getToken(Sql.INTERVAL, 0)!;
    }
    public characterString(): CharacterStringContext {
        return this.getRuleContext(0, CharacterStringContext)!;
    }
    public intervalQualifier(): IntervalQualifierContext | null {
        return this.getRuleContext(0, IntervalQualifierContext);
    }
    public PLUS(): antlr.TerminalNode | null {
        return this.getToken(Sql.PLUS, 0);
    }
    public MINUS(): antlr.TerminalNode | null {
        return this.getToken(Sql.MINUS, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_intervalLiteral;
    }
}


export class DateTimeLiteralContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_dateTimeLiteral;
    }
    public override copyFrom(ctx: DateTimeLiteralContext): void {
        super.copyFrom(ctx);
    }
}
export class DateLiteralContext extends DateTimeLiteralContext {
    public constructor(ctx: DateTimeLiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DATE(): antlr.TerminalNode {
        return this.getToken(Sql.DATE, 0)!;
    }
    public characterString(): CharacterStringContext {
        return this.getRuleContext(0, CharacterStringContext)!;
    }
}
export class TimestampLiteralContext extends DateTimeLiteralContext {
    public constructor(ctx: DateTimeLiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TIMESTAMP(): antlr.TerminalNode {
        return this.getToken(Sql.TIMESTAMP, 0)!;
    }
    public characterString(): CharacterStringContext {
        return this.getRuleContext(0, CharacterStringContext)!;
    }
    public withOrWithoutTimeZone(): WithOrWithoutTimeZoneContext | null {
        return this.getRuleContext(0, WithOrWithoutTimeZoneContext);
    }
}


export class IntegerLiteralContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNSIGNED_INTEGER(): antlr.TerminalNode {
        return this.getToken(Sql.UNSIGNED_INTEGER, 0)!;
    }
    public PLUS(): antlr.TerminalNode | null {
        return this.getToken(Sql.PLUS, 0);
    }
    public MINUS(): antlr.TerminalNode | null {
        return this.getToken(Sql.MINUS, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_integerLiteral;
    }
}


export class LiteralContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_literal;
    }
    public override copyFrom(ctx: LiteralContext): void {
        super.copyFrom(ctx);
    }
}
export class IntervalLiteral0Context extends LiteralContext {
    public constructor(ctx: LiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public intervalLiteral(): IntervalLiteralContext {
        return this.getRuleContext(0, IntervalLiteralContext)!;
    }
}
export class BinaryStringLiteralContext extends LiteralContext {
    public constructor(ctx: LiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public BINARY_STRING(): antlr.TerminalNode {
        return this.getToken(Sql.BINARY_STRING, 0)!;
    }
}
export class FloatLiteralContext extends LiteralContext {
    public constructor(ctx: LiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public UNSIGNED_FLOAT(): antlr.TerminalNode {
        return this.getToken(Sql.UNSIGNED_FLOAT, 0)!;
    }
    public PLUS(): antlr.TerminalNode | null {
        return this.getToken(Sql.PLUS, 0);
    }
    public MINUS(): antlr.TerminalNode | null {
        return this.getToken(Sql.MINUS, 0);
    }
}
export class BooleanLiteralContext extends LiteralContext {
    public constructor(ctx: LiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TRUE(): antlr.TerminalNode | null {
        return this.getToken(Sql.TRUE, 0);
    }
    public FALSE(): antlr.TerminalNode | null {
        return this.getToken(Sql.FALSE, 0);
    }
    public ON(): antlr.TerminalNode | null {
        return this.getToken(Sql.ON, 0);
    }
    public OFF(): antlr.TerminalNode | null {
        return this.getToken(Sql.OFF, 0);
    }
}
export class UUIDLiteralContext extends LiteralContext {
    public constructor(ctx: LiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public UUID(): antlr.TerminalNode {
        return this.getToken(Sql.UUID, 0)!;
    }
    public characterString(): CharacterStringContext {
        return this.getRuleContext(0, CharacterStringContext)!;
    }
}
export class DurationLiteralContext extends LiteralContext {
    public constructor(ctx: LiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DURATION(): antlr.TerminalNode {
        return this.getToken(Sql.DURATION, 0)!;
    }
    public characterString(): CharacterStringContext {
        return this.getRuleContext(0, CharacterStringContext)!;
    }
}
export class CharacterStringLiteralContext extends LiteralContext {
    public constructor(ctx: LiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public characterString(): CharacterStringContext {
        return this.getRuleContext(0, CharacterStringContext)!;
    }
}
export class DateTimeLiteral0Context extends LiteralContext {
    public constructor(ctx: LiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public dateTimeLiteral(): DateTimeLiteralContext {
        return this.getRuleContext(0, DateTimeLiteralContext)!;
    }
}
export class UriLiteralContext extends LiteralContext {
    public constructor(ctx: LiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public URI(): antlr.TerminalNode {
        return this.getToken(Sql.URI, 0)!;
    }
    public characterString(): CharacterStringContext {
        return this.getRuleContext(0, CharacterStringContext)!;
    }
}
export class IntegerLiteral0Context extends LiteralContext {
    public constructor(ctx: LiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public integerLiteral(): IntegerLiteralContext {
        return this.getRuleContext(0, IntegerLiteralContext)!;
    }
}
export class KeywordLiteralContext extends LiteralContext {
    public constructor(ctx: LiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public KEYWORD(): antlr.TerminalNode {
        return this.getToken(Sql.KEYWORD, 0)!;
    }
    public characterString(): CharacterStringContext {
        return this.getRuleContext(0, CharacterStringContext)!;
    }
}
export class NullLiteralContext extends LiteralContext {
    public constructor(ctx: LiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NULL(): antlr.TerminalNode {
        return this.getToken(Sql.NULL, 0)!;
    }
}
export class TimeLiteralContext extends LiteralContext {
    public constructor(ctx: LiteralContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TIME(): antlr.TerminalNode {
        return this.getToken(Sql.TIME, 0)!;
    }
    public characterString(): CharacterStringContext {
        return this.getRuleContext(0, CharacterStringContext)!;
    }
}


export class DollarStringTextContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public DM_TEXT(): antlr.TerminalNode[];
    public DM_TEXT(i: number): antlr.TerminalNode | null;
    public DM_TEXT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.DM_TEXT);
    	} else {
    		return this.getToken(Sql.DM_TEXT, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_dollarStringText;
    }
}


export class CharacterStringContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_characterString;
    }
    public override copyFrom(ctx: CharacterStringContext): void {
        super.copyFrom(ctx);
    }
}
export class DollarStringContext extends CharacterStringContext {
    public constructor(ctx: CharacterStringContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DOLLAR_TAG(): antlr.TerminalNode {
        return this.getToken(Sql.DOLLAR_TAG, 0)!;
    }
    public DM_END_TAG(): antlr.TerminalNode {
        return this.getToken(Sql.DM_END_TAG, 0)!;
    }
    public dollarStringText(): DollarStringTextContext | null {
        return this.getRuleContext(0, DollarStringTextContext);
    }
}
export class SqlStandardStringContext extends CharacterStringContext {
    public constructor(ctx: CharacterStringContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CHARACTER_STRING(): antlr.TerminalNode {
        return this.getToken(Sql.CHARACTER_STRING, 0)!;
    }
}
export class CEscapesStringContext extends CharacterStringContext {
    public constructor(ctx: CharacterStringContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public C_ESCAPES_STRING(): antlr.TerminalNode {
        return this.getToken(Sql.C_ESCAPES_STRING, 0)!;
    }
}


export class IntervalQualifierContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_intervalQualifier;
    }
    public override copyFrom(ctx: IntervalQualifierContext): void {
        super.copyFrom(ctx);
    }
}
export class SingleFieldIntervalContext extends IntervalQualifierContext {
    public constructor(ctx: IntervalQualifierContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public singleDatetimeField(): SingleDatetimeFieldContext {
        return this.getRuleContext(0, SingleDatetimeFieldContext)!;
    }
}
export class MultiFieldIntervalContext extends IntervalQualifierContext {
    public _startField?: NonSecondPrimaryDatetimeFieldContext;
    public _endField?: SingleDatetimeFieldContext;
    public constructor(ctx: IntervalQualifierContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TO(): antlr.TerminalNode {
        return this.getToken(Sql.TO, 0)!;
    }
    public nonSecondPrimaryDatetimeField(): NonSecondPrimaryDatetimeFieldContext {
        return this.getRuleContext(0, NonSecondPrimaryDatetimeFieldContext)!;
    }
    public singleDatetimeField(): SingleDatetimeFieldContext {
        return this.getRuleContext(0, SingleDatetimeFieldContext)!;
    }
}


export class IntervalFractionalSecondsPrecisionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNSIGNED_INTEGER(): antlr.TerminalNode {
        return this.getToken(Sql.UNSIGNED_INTEGER, 0)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_intervalFractionalSecondsPrecision;
    }
}


export class NonSecondPrimaryDatetimeFieldContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public YEAR(): antlr.TerminalNode | null {
        return this.getToken(Sql.YEAR, 0);
    }
    public MONTH(): antlr.TerminalNode | null {
        return this.getToken(Sql.MONTH, 0);
    }
    public DAY(): antlr.TerminalNode | null {
        return this.getToken(Sql.DAY, 0);
    }
    public HOUR(): antlr.TerminalNode | null {
        return this.getToken(Sql.HOUR, 0);
    }
    public MINUTE(): antlr.TerminalNode | null {
        return this.getToken(Sql.MINUTE, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_nonSecondPrimaryDatetimeField;
    }
}


export class SingleDatetimeFieldContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public nonSecondPrimaryDatetimeField(): NonSecondPrimaryDatetimeFieldContext | null {
        return this.getRuleContext(0, NonSecondPrimaryDatetimeFieldContext);
    }
    public SECOND(): antlr.TerminalNode | null {
        return this.getToken(Sql.SECOND, 0);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public intervalFractionalSecondsPrecision(): IntervalFractionalSecondsPrecisionContext | null {
        return this.getRuleContext(0, IntervalFractionalSecondsPrecisionContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_singleDatetimeField;
    }
}


export class IdentifierChainContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode[];
    public DOT(i: number): antlr.TerminalNode | null;
    public DOT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.DOT);
    	} else {
    		return this.getToken(Sql.DOT, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_identifierChain;
    }
}


export class IdentifierContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_identifier;
    }
    public override copyFrom(ctx: IdentifierContext): void {
        super.copyFrom(ctx);
    }
}
export class DelimitedIdentifierContext extends IdentifierContext {
    public constructor(ctx: IdentifierContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DELIMITED_IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(Sql.DELIMITED_IDENTIFIER, 0)!;
    }
}
export class RegularIdentifierContext extends IdentifierContext {
    public constructor(ctx: IdentifierContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public REGULAR_IDENTIFIER(): antlr.TerminalNode | null {
        return this.getToken(Sql.REGULAR_IDENTIFIER, 0);
    }
    public nonReservedKeyword(): NonReservedKeywordContext | null {
        return this.getRuleContext(0, NonReservedKeywordContext);
    }
}


export class NonReservedKeywordContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public START(): antlr.TerminalNode | null {
        return this.getToken(Sql.START, 0);
    }
    public END(): antlr.TerminalNode | null {
        return this.getToken(Sql.END, 0);
    }
    public COMMITTED(): antlr.TerminalNode | null {
        return this.getToken(Sql.COMMITTED, 0);
    }
    public UNCOMMITTED(): antlr.TerminalNode | null {
        return this.getToken(Sql.UNCOMMITTED, 0);
    }
    public TIMEZONE(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIMEZONE, 0);
    }
    public VERSION(): antlr.TerminalNode | null {
        return this.getToken(Sql.VERSION, 0);
    }
    public SYSTEM_TIME(): antlr.TerminalNode | null {
        return this.getToken(Sql.SYSTEM_TIME, 0);
    }
    public VALID_TIME(): antlr.TerminalNode | null {
        return this.getToken(Sql.VALID_TIME, 0);
    }
    public SELECT(): antlr.TerminalNode | null {
        return this.getToken(Sql.SELECT, 0);
    }
    public INSERT(): antlr.TerminalNode | null {
        return this.getToken(Sql.INSERT, 0);
    }
    public UPDATE(): antlr.TerminalNode | null {
        return this.getToken(Sql.UPDATE, 0);
    }
    public DELETE(): antlr.TerminalNode | null {
        return this.getToken(Sql.DELETE, 0);
    }
    public ERASE(): antlr.TerminalNode | null {
        return this.getToken(Sql.ERASE, 0);
    }
    public SETTING(): antlr.TerminalNode | null {
        return this.getToken(Sql.SETTING, 0);
    }
    public ROLE(): antlr.TerminalNode | null {
        return this.getToken(Sql.ROLE, 0);
    }
    public USER(): antlr.TerminalNode | null {
        return this.getToken(Sql.USER, 0);
    }
    public PASSWORD(): antlr.TerminalNode | null {
        return this.getToken(Sql.PASSWORD, 0);
    }
    public VARBINARY(): antlr.TerminalNode | null {
        return this.getToken(Sql.VARBINARY, 0);
    }
    public BYTEA(): antlr.TerminalNode | null {
        return this.getToken(Sql.BYTEA, 0);
    }
    public URI(): antlr.TerminalNode | null {
        return this.getToken(Sql.URI, 0);
    }
    public OID(): antlr.TerminalNode | null {
        return this.getToken(Sql.OID, 0);
    }
    public COPY(): antlr.TerminalNode | null {
        return this.getToken(Sql.COPY, 0);
    }
    public FORMAT(): antlr.TerminalNode | null {
        return this.getToken(Sql.FORMAT, 0);
    }
    public ATTACH(): antlr.TerminalNode | null {
        return this.getToken(Sql.ATTACH, 0);
    }
    public DETACH(): antlr.TerminalNode | null {
        return this.getToken(Sql.DETACH, 0);
    }
    public DATABASE(): antlr.TerminalNode | null {
        return this.getToken(Sql.DATABASE, 0);
    }
    public LEVEL(): antlr.TerminalNode | null {
        return this.getToken(Sql.LEVEL, 0);
    }
    public FILTER(): antlr.TerminalNode | null {
        return this.getToken(Sql.FILTER, 0);
    }
    public TABLE(): antlr.TerminalNode | null {
        return this.getToken(Sql.TABLE, 0);
    }
    public METADATA(): antlr.TerminalNode | null {
        return this.getToken(Sql.METADATA, 0);
    }
    public SYNC(): antlr.TerminalNode | null {
        return this.getToken(Sql.SYNC, 0);
    }
    public DISCARD(): antlr.TerminalNode | null {
        return this.getToken(Sql.DISCARD, 0);
    }
    public PLANS(): antlr.TerminalNode | null {
        return this.getToken(Sql.PLANS, 0);
    }
    public TEMP(): antlr.TerminalNode | null {
        return this.getToken(Sql.TEMP, 0);
    }
    public TEMPORARY(): antlr.TerminalNode | null {
        return this.getToken(Sql.TEMPORARY, 0);
    }
    public SEQUENCES(): antlr.TerminalNode | null {
        return this.getToken(Sql.SEQUENCES, 0);
    }
    public setFunctionType(): SetFunctionTypeContext | null {
        return this.getRuleContext(0, SetFunctionTypeContext);
    }
    public primaryDatetimeField(): PrimaryDatetimeFieldContext | null {
        return this.getRuleContext(0, PrimaryDatetimeFieldContext);
    }
    public pgExtractField(): PgExtractFieldContext | null {
        return this.getRuleContext(0, PgExtractFieldContext);
    }
    public rankFunctionType(): RankFunctionTypeContext | null {
        return this.getRuleContext(0, RankFunctionTypeContext);
    }
    public AT(): antlr.TerminalNode | null {
        return this.getToken(Sql.AT, 0);
    }
    public BETWEEN(): antlr.TerminalNode | null {
        return this.getToken(Sql.BETWEEN, 0);
    }
    public BY(): antlr.TerminalNode | null {
        return this.getToken(Sql.BY, 0);
    }
    public CURRENT(): antlr.TerminalNode | null {
        return this.getToken(Sql.CURRENT, 0);
    }
    public FIRST(): antlr.TerminalNode | null {
        return this.getToken(Sql.FIRST, 0);
    }
    public LAST(): antlr.TerminalNode | null {
        return this.getToken(Sql.LAST, 0);
    }
    public NEXT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NEXT, 0);
    }
    public OF(): antlr.TerminalNode | null {
        return this.getToken(Sql.OF, 0);
    }
    public POSITION(): antlr.TerminalNode | null {
        return this.getToken(Sql.POSITION, 0);
    }
    public INT2(): antlr.TerminalNode | null {
        return this.getToken(Sql.INT2, 0);
    }
    public INT4(): antlr.TerminalNode | null {
        return this.getToken(Sql.INT4, 0);
    }
    public INT8(): antlr.TerminalNode | null {
        return this.getToken(Sql.INT8, 0);
    }
    public FLOAT4(): antlr.TerminalNode | null {
        return this.getToken(Sql.FLOAT4, 0);
    }
    public FLOAT8(): antlr.TerminalNode | null {
        return this.getToken(Sql.FLOAT8, 0);
    }
    public BOOL(): antlr.TerminalNode | null {
        return this.getToken(Sql.BOOL, 0);
    }
    public BPCHAR(): antlr.TerminalNode | null {
        return this.getToken(Sql.BPCHAR, 0);
    }
    public NAME(): antlr.TerminalNode | null {
        return this.getToken(Sql.NAME, 0);
    }
    public BIGINT(): antlr.TerminalNode | null {
        return this.getToken(Sql.BIGINT, 0);
    }
    public BOOLEAN(): antlr.TerminalNode | null {
        return this.getToken(Sql.BOOLEAN, 0);
    }
    public CHAR(): antlr.TerminalNode | null {
        return this.getToken(Sql.CHAR, 0);
    }
    public DATE(): antlr.TerminalNode | null {
        return this.getToken(Sql.DATE, 0);
    }
    public DEC(): antlr.TerminalNode | null {
        return this.getToken(Sql.DEC, 0);
    }
    public DECIMAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.DECIMAL, 0);
    }
    public DOUBLE(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOUBLE, 0);
    }
    public DURATION(): antlr.TerminalNode | null {
        return this.getToken(Sql.DURATION, 0);
    }
    public FLOAT(): antlr.TerminalNode | null {
        return this.getToken(Sql.FLOAT, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(Sql.INT, 0);
    }
    public INTEGER(): antlr.TerminalNode | null {
        return this.getToken(Sql.INTEGER, 0);
    }
    public INTERVAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.INTERVAL, 0);
    }
    public KEYWORD(): antlr.TerminalNode | null {
        return this.getToken(Sql.KEYWORD, 0);
    }
    public NUMERIC(): antlr.TerminalNode | null {
        return this.getToken(Sql.NUMERIC, 0);
    }
    public OBJECT(): antlr.TerminalNode | null {
        return this.getToken(Sql.OBJECT, 0);
    }
    public PERIOD(): antlr.TerminalNode | null {
        return this.getToken(Sql.PERIOD, 0);
    }
    public PRECISION(): antlr.TerminalNode | null {
        return this.getToken(Sql.PRECISION, 0);
    }
    public REAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.REAL, 0);
    }
    public RECORD(): antlr.TerminalNode | null {
        return this.getToken(Sql.RECORD, 0);
    }
    public REGCLASS(): antlr.TerminalNode | null {
        return this.getToken(Sql.REGCLASS, 0);
    }
    public REGPROC(): antlr.TerminalNode | null {
        return this.getToken(Sql.REGPROC, 0);
    }
    public ROW(): antlr.TerminalNode | null {
        return this.getToken(Sql.ROW, 0);
    }
    public SMALLINT(): antlr.TerminalNode | null {
        return this.getToken(Sql.SMALLINT, 0);
    }
    public TEXT(): antlr.TerminalNode | null {
        return this.getToken(Sql.TEXT, 0);
    }
    public TIME(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIME, 0);
    }
    public TIMESTAMP(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIMESTAMP, 0);
    }
    public TIMESTAMPTZ(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIMESTAMPTZ, 0);
    }
    public TSTZRANGE(): antlr.TerminalNode | null {
        return this.getToken(Sql.TSTZRANGE, 0);
    }
    public UUID(): antlr.TerminalNode | null {
        return this.getToken(Sql.UUID, 0);
    }
    public VARCHAR(): antlr.TerminalNode | null {
        return this.getToken(Sql.VARCHAR, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_nonReservedKeyword;
    }
}


export class ColumnNameContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_columnName;
    }
}


export class ColumnLabelContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public CURRENT_USER(): antlr.TerminalNode | null {
        return this.getToken(Sql.CURRENT_USER, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_columnLabel;
    }
}


export class DataTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_dataType;
    }
    public override copyFrom(ctx: DataTypeContext): void {
        super.copyFrom(ctx);
    }
}
export class DurationTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DURATION(): antlr.TerminalNode {
        return this.getToken(Sql.DURATION, 0)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public precision(): PrecisionContext | null {
        return this.getRuleContext(0, PrecisionContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class KeywordTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public KEYWORD(): antlr.TerminalNode {
        return this.getToken(Sql.KEYWORD, 0)!;
    }
}
export class CharacterStringTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CHAR(): antlr.TerminalNode | null {
        return this.getToken(Sql.CHAR, 0);
    }
    public VARCHAR(): antlr.TerminalNode | null {
        return this.getToken(Sql.VARCHAR, 0);
    }
    public TEXT(): antlr.TerminalNode | null {
        return this.getToken(Sql.TEXT, 0);
    }
    public BPCHAR(): antlr.TerminalNode | null {
        return this.getToken(Sql.BPCHAR, 0);
    }
    public NAME(): antlr.TerminalNode | null {
        return this.getToken(Sql.NAME, 0);
    }
}
export class IntervalTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public INTERVAL(): antlr.TerminalNode {
        return this.getToken(Sql.INTERVAL, 0)!;
    }
    public intervalQualifier(): IntervalQualifierContext | null {
        return this.getRuleContext(0, IntervalQualifierContext);
    }
}
export class OidTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public OID(): antlr.TerminalNode {
        return this.getToken(Sql.OID, 0)!;
    }
}
export class UuidTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public UUID(): antlr.TerminalNode {
        return this.getToken(Sql.UUID, 0)!;
    }
}
export class BooleanTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public BOOLEAN(): antlr.TerminalNode | null {
        return this.getToken(Sql.BOOLEAN, 0);
    }
    public BOOL(): antlr.TerminalNode | null {
        return this.getToken(Sql.BOOL, 0);
    }
}
export class RegProcTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public REGPROC(): antlr.TerminalNode {
        return this.getToken(Sql.REGPROC, 0)!;
    }
}
export class RowTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ROW(): antlr.TerminalNode {
        return this.getToken(Sql.ROW, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public fieldDefinition(): FieldDefinitionContext[];
    public fieldDefinition(i: number): FieldDefinitionContext | null;
    public fieldDefinition(i?: number): FieldDefinitionContext[] | FieldDefinitionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(FieldDefinitionContext);
        }

        return this.getRuleContext(i, FieldDefinitionContext);
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}
export class RealTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public REAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.REAL, 0);
    }
    public FLOAT4(): antlr.TerminalNode | null {
        return this.getToken(Sql.FLOAT4, 0);
    }
}
export class TimestampTzTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TIMESTAMPTZ(): antlr.TerminalNode {
        return this.getToken(Sql.TIMESTAMPTZ, 0)!;
    }
}
export class FloatTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public FLOAT(): antlr.TerminalNode {
        return this.getToken(Sql.FLOAT, 0)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public precision(): PrecisionContext | null {
        return this.getRuleContext(0, PrecisionContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class TimeTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TIME(): antlr.TerminalNode {
        return this.getToken(Sql.TIME, 0)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public precision(): PrecisionContext | null {
        return this.getRuleContext(0, PrecisionContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
    public withOrWithoutTimeZone(): WithOrWithoutTimeZoneContext | null {
        return this.getRuleContext(0, WithOrWithoutTimeZoneContext);
    }
}
export class UriTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public URI(): antlr.TerminalNode {
        return this.getToken(Sql.URI, 0)!;
    }
}
export class IntegerTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SMALLINT(): antlr.TerminalNode | null {
        return this.getToken(Sql.SMALLINT, 0);
    }
    public INTEGER(): antlr.TerminalNode | null {
        return this.getToken(Sql.INTEGER, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(Sql.INT, 0);
    }
    public BIGINT(): antlr.TerminalNode | null {
        return this.getToken(Sql.BIGINT, 0);
    }
    public INT2(): antlr.TerminalNode | null {
        return this.getToken(Sql.INT2, 0);
    }
    public INT4(): antlr.TerminalNode | null {
        return this.getToken(Sql.INT4, 0);
    }
    public INT8(): antlr.TerminalNode | null {
        return this.getToken(Sql.INT8, 0);
    }
}
export class ArrayTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public dataType(): DataTypeContext {
        return this.getRuleContext(0, DataTypeContext)!;
    }
    public ARRAY(): antlr.TerminalNode | null {
        return this.getToken(Sql.ARRAY, 0);
    }
    public LBRACK(): antlr.TerminalNode | null {
        return this.getToken(Sql.LBRACK, 0);
    }
    public maximumCardinality(): MaximumCardinalityContext | null {
        return this.getRuleContext(0, MaximumCardinalityContext);
    }
    public RBRACK(): antlr.TerminalNode | null {
        return this.getToken(Sql.RBRACK, 0);
    }
}
export class RegClassTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public REGCLASS(): antlr.TerminalNode {
        return this.getToken(Sql.REGCLASS, 0)!;
    }
}
export class VarbinaryTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public VARBINARY(): antlr.TerminalNode | null {
        return this.getToken(Sql.VARBINARY, 0);
    }
    public BYTEA(): antlr.TerminalNode | null {
        return this.getToken(Sql.BYTEA, 0);
    }
}
export class DoubleTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DOUBLE(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOUBLE, 0);
    }
    public FLOAT8(): antlr.TerminalNode | null {
        return this.getToken(Sql.FLOAT8, 0);
    }
    public PRECISION(): antlr.TerminalNode | null {
        return this.getToken(Sql.PRECISION, 0);
    }
}
export class DecimalTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NUMERIC(): antlr.TerminalNode | null {
        return this.getToken(Sql.NUMERIC, 0);
    }
    public DECIMAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.DECIMAL, 0);
    }
    public DEC(): antlr.TerminalNode | null {
        return this.getToken(Sql.DEC, 0);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public precision(): PrecisionContext | null {
        return this.getRuleContext(0, PrecisionContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
    public COMMA(): antlr.TerminalNode | null {
        return this.getToken(Sql.COMMA, 0);
    }
    public scale(): ScaleContext | null {
        return this.getRuleContext(0, ScaleContext);
    }
}
export class TimestampTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TIMESTAMP(): antlr.TerminalNode {
        return this.getToken(Sql.TIMESTAMP, 0)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public precision(): PrecisionContext | null {
        return this.getRuleContext(0, PrecisionContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
    public withOrWithoutTimeZone(): WithOrWithoutTimeZoneContext | null {
        return this.getRuleContext(0, WithOrWithoutTimeZoneContext);
    }
}
export class DateTypeContext extends DataTypeContext {
    public constructor(ctx: DataTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DATE(): antlr.TerminalNode {
        return this.getToken(Sql.DATE, 0)!;
    }
}


export class PrecisionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNSIGNED_INTEGER(): antlr.TerminalNode {
        return this.getToken(Sql.UNSIGNED_INTEGER, 0)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_precision;
    }
}


export class ScaleContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNSIGNED_INTEGER(): antlr.TerminalNode {
        return this.getToken(Sql.UNSIGNED_INTEGER, 0)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_scale;
    }
}


export class CharLengthUnitsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CHARACTERS(): antlr.TerminalNode | null {
        return this.getToken(Sql.CHARACTERS, 0);
    }
    public OCTETS(): antlr.TerminalNode | null {
        return this.getToken(Sql.OCTETS, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_charLengthUnits;
    }
}


export class WithOrWithoutTimeZoneContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_withOrWithoutTimeZone;
    }
    public override copyFrom(ctx: WithOrWithoutTimeZoneContext): void {
        super.copyFrom(ctx);
    }
}
export class WithTimeZoneContext extends WithOrWithoutTimeZoneContext {
    public constructor(ctx: WithOrWithoutTimeZoneContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public WITH(): antlr.TerminalNode {
        return this.getToken(Sql.WITH, 0)!;
    }
    public TIME(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIME, 0);
    }
    public ZONE(): antlr.TerminalNode | null {
        return this.getToken(Sql.ZONE, 0);
    }
    public TIMEZONE(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIMEZONE, 0);
    }
}
export class WithoutTimeZoneContext extends WithOrWithoutTimeZoneContext {
    public constructor(ctx: WithOrWithoutTimeZoneContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public WITHOUT(): antlr.TerminalNode {
        return this.getToken(Sql.WITHOUT, 0)!;
    }
    public TIME(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIME, 0);
    }
    public ZONE(): antlr.TerminalNode | null {
        return this.getToken(Sql.ZONE, 0);
    }
    public TIMEZONE(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIMEZONE, 0);
    }
}


export class MaximumCardinalityContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNSIGNED_INTEGER(): antlr.TerminalNode {
        return this.getToken(Sql.UNSIGNED_INTEGER, 0)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_maximumCardinality;
    }
}


export class FieldDefinitionContext extends antlr.ParserRuleContext {
    public _fieldName?: IdentifierContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public dataType(): DataTypeContext {
        return this.getRuleContext(0, DataTypeContext)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_fieldDefinition;
    }
}


export class ExprContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_expr;
    }
    public override copyFrom(ctx: ExprContext): void {
        super.copyFrom(ctx);
    }
}
export class AndExprContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public AND(): antlr.TerminalNode {
        return this.getToken(Sql.AND, 0)!;
    }
}
export class PeriodContainsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public CONTAINS(): antlr.TerminalNode {
        return this.getToken(Sql.CONTAINS, 0)!;
    }
}
export class PeriodImmediatelyLeadsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public IMMEDIATELY(): antlr.TerminalNode {
        return this.getToken(Sql.IMMEDIATELY, 0)!;
    }
    public LEADS(): antlr.TerminalNode {
        return this.getToken(Sql.LEADS, 0)!;
    }
}
export class PeriodImmediatelyPrecedesPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public IMMEDIATELY(): antlr.TerminalNode {
        return this.getToken(Sql.IMMEDIATELY, 0)!;
    }
    public PRECEDES(): antlr.TerminalNode {
        return this.getToken(Sql.PRECEDES, 0)!;
    }
}
export class IsBooleanValueExprContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public IS(): antlr.TerminalNode {
        return this.getToken(Sql.IS, 0)!;
    }
    public booleanValue(): BooleanValueContext {
        return this.getRuleContext(0, BooleanValueContext)!;
    }
    public NOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT, 0);
    }
}
export class PeriodStrictlySucceedsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public STRICTLY(): antlr.TerminalNode {
        return this.getToken(Sql.STRICTLY, 0)!;
    }
    public SUCCEEDS(): antlr.TerminalNode {
        return this.getToken(Sql.SUCCEEDS, 0)!;
    }
}
export class PostgresRegexPredicateContext extends ExprContext {
    public _xqueryPattern?: CommonValueExprContext;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public postgresRegexOperator(): PostgresRegexOperatorContext {
        return this.getRuleContext(0, PostgresRegexOperatorContext)!;
    }
    public commonValueExpr(): CommonValueExprContext {
        return this.getRuleContext(0, CommonValueExprContext)!;
    }
}
export class UnaryNotExprContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NOT(): antlr.TerminalNode {
        return this.getToken(Sql.NOT, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class PeriodLeadsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public LEADS(): antlr.TerminalNode {
        return this.getToken(Sql.LEADS, 0)!;
    }
}
export class PeriodSucceedsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public SUCCEEDS(): antlr.TerminalNode {
        return this.getToken(Sql.SUCCEEDS, 0)!;
    }
}
export class PeriodPrecedesPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public PRECEDES(): antlr.TerminalNode {
        return this.getToken(Sql.PRECEDES, 0)!;
    }
}
export class ComparisonPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public compOp(): CompOpContext {
        return this.getRuleContext(0, CompOpContext)!;
    }
}
export class CommonValueExpr0Context extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public commonValueExpr(): CommonValueExprContext {
        return this.getRuleContext(0, CommonValueExprContext)!;
    }
}
export class PeriodImmediatelySucceedsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public IMMEDIATELY(): antlr.TerminalNode {
        return this.getToken(Sql.IMMEDIATELY, 0)!;
    }
    public SUCCEEDS(): antlr.TerminalNode {
        return this.getToken(Sql.SUCCEEDS, 0)!;
    }
}
export class QuantifiedComparisonPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public compOp(): CompOpContext {
        return this.getRuleContext(0, CompOpContext)!;
    }
    public quantifier(): QuantifierContext {
        return this.getRuleContext(0, QuantifierContext)!;
    }
    public quantifiedComparisonPredicatePart3(): QuantifiedComparisonPredicatePart3Context {
        return this.getRuleContext(0, QuantifiedComparisonPredicatePart3Context)!;
    }
}
export class PeriodEqualsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public EQUALS(): antlr.TerminalNode {
        return this.getToken(Sql.EQUALS, 0)!;
    }
}
export class PeriodStrictlyLeadsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public STRICTLY(): antlr.TerminalNode {
        return this.getToken(Sql.STRICTLY, 0)!;
    }
    public LEADS(): antlr.TerminalNode {
        return this.getToken(Sql.LEADS, 0)!;
    }
}
export class DistinctFromPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public IS(): antlr.TerminalNode {
        return this.getToken(Sql.IS, 0)!;
    }
    public DISTINCT(): antlr.TerminalNode {
        return this.getToken(Sql.DISTINCT, 0)!;
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public NOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT, 0);
    }
}
export class BetweenPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public commonValueExpr(): CommonValueExprContext[];
    public commonValueExpr(i: number): CommonValueExprContext | null;
    public commonValueExpr(i?: number): CommonValueExprContext[] | CommonValueExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CommonValueExprContext);
        }

        return this.getRuleContext(i, CommonValueExprContext);
    }
    public BETWEEN(): antlr.TerminalNode {
        return this.getToken(Sql.BETWEEN, 0)!;
    }
    public AND(): antlr.TerminalNode {
        return this.getToken(Sql.AND, 0)!;
    }
    public NOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT, 0);
    }
    public ASYMMETRIC(): antlr.TerminalNode | null {
        return this.getToken(Sql.ASYMMETRIC, 0);
    }
    public SYMMETRIC(): antlr.TerminalNode | null {
        return this.getToken(Sql.SYMMETRIC, 0);
    }
}
export class PeriodImmediatelyLagsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public IMMEDIATELY(): antlr.TerminalNode {
        return this.getToken(Sql.IMMEDIATELY, 0)!;
    }
    public LAGS(): antlr.TerminalNode {
        return this.getToken(Sql.LAGS, 0)!;
    }
}
export class PeriodStrictlyLagsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public STRICTLY(): antlr.TerminalNode {
        return this.getToken(Sql.STRICTLY, 0)!;
    }
    public LAGS(): antlr.TerminalNode {
        return this.getToken(Sql.LAGS, 0)!;
    }
}
export class LikePredicateContext extends ExprContext {
    public _likePattern?: CommonValueExprContext;
    public _likeEscape?: CommonValueExprContext;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public LIKE(): antlr.TerminalNode | null {
        return this.getToken(Sql.LIKE, 0);
    }
    public ILIKE(): antlr.TerminalNode | null {
        return this.getToken(Sql.ILIKE, 0);
    }
    public commonValueExpr(): CommonValueExprContext[];
    public commonValueExpr(i: number): CommonValueExprContext | null;
    public commonValueExpr(i?: number): CommonValueExprContext[] | CommonValueExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CommonValueExprContext);
        }

        return this.getRuleContext(i, CommonValueExprContext);
    }
    public NOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT, 0);
    }
    public ESCAPE(): antlr.TerminalNode | null {
        return this.getToken(Sql.ESCAPE, 0);
    }
}
export class InPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public IN(): antlr.TerminalNode {
        return this.getToken(Sql.IN, 0)!;
    }
    public inPredicateValue(): InPredicateValueContext {
        return this.getRuleContext(0, InPredicateValueContext)!;
    }
    public NOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT, 0);
    }
}
export class PeriodStrictlyPrecedesPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public STRICTLY(): antlr.TerminalNode {
        return this.getToken(Sql.STRICTLY, 0)!;
    }
    public PRECEDES(): antlr.TerminalNode {
        return this.getToken(Sql.PRECEDES, 0)!;
    }
}
export class PeriodLagsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public LAGS(): antlr.TerminalNode {
        return this.getToken(Sql.LAGS, 0)!;
    }
}
export class OrExprContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public OR(): antlr.TerminalNode {
        return this.getToken(Sql.OR, 0)!;
    }
}
export class PeriodStrictlyContainsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public STRICTLY(): antlr.TerminalNode {
        return this.getToken(Sql.STRICTLY, 0)!;
    }
    public CONTAINS(): antlr.TerminalNode {
        return this.getToken(Sql.CONTAINS, 0)!;
    }
}
export class PeriodStrictlyOverlapsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public STRICTLY(): antlr.TerminalNode {
        return this.getToken(Sql.STRICTLY, 0)!;
    }
    public OVERLAPS(): antlr.TerminalNode {
        return this.getToken(Sql.OVERLAPS, 0)!;
    }
}
export class NullPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public IS(): antlr.TerminalNode {
        return this.getToken(Sql.IS, 0)!;
    }
    public NULL(): antlr.TerminalNode {
        return this.getToken(Sql.NULL, 0)!;
    }
    public NOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT, 0);
    }
}
export class LikeRegexPredicateContext extends ExprContext {
    public _xqueryPattern?: CommonValueExprContext;
    public _xqueryOptionFlag?: CommonValueExprContext;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public LIKE_REGEX(): antlr.TerminalNode {
        return this.getToken(Sql.LIKE_REGEX, 0)!;
    }
    public commonValueExpr(): CommonValueExprContext[];
    public commonValueExpr(i: number): CommonValueExprContext | null;
    public commonValueExpr(i?: number): CommonValueExprContext[] | CommonValueExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CommonValueExprContext);
        }

        return this.getRuleContext(i, CommonValueExprContext);
    }
    public NOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT, 0);
    }
    public FLAG(): antlr.TerminalNode | null {
        return this.getToken(Sql.FLAG, 0);
    }
}
export class PeriodOverlapsPredicateContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public OVERLAPS(): antlr.TerminalNode {
        return this.getToken(Sql.OVERLAPS, 0)!;
    }
}


export class CommonValueExprContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_commonValueExpr;
    }
    public override copyFrom(ctx: CommonValueExprContext): void {
        super.copyFrom(ctx);
    }
}
export class AggregateFunctionExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public aggregateFunction(): AggregateFunctionContext {
        return this.getRuleContext(0, AggregateFunctionContext)!;
    }
}
export class TrimArrayFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TRIM_ARRAY(): antlr.TerminalNode {
        return this.getToken(Sql.TRIM_ARRAY, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(Sql.COMMA, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class CurrentSchemasFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CURRENT_SCHEMAS(): antlr.TerminalNode {
        return this.getToken(Sql.CURRENT_SCHEMAS, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
}
export class ConcatOrBitwiseExprContext extends CommonValueExprContext {
    public _op?: Token | null;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public commonValueExpr(): CommonValueExprContext[];
    public commonValueExpr(i: number): CommonValueExprContext | null;
    public commonValueExpr(i?: number): CommonValueExprContext[] | CommonValueExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CommonValueExprContext);
        }

        return this.getRuleContext(i, CommonValueExprContext);
    }
    public CONCAT(): antlr.TerminalNode | null {
        return this.getToken(Sql.CONCAT, 0);
    }
    public AMPERSAND(): antlr.TerminalNode | null {
        return this.getToken(Sql.AMPERSAND, 0);
    }
    public BITWISE_OR(): antlr.TerminalNode | null {
        return this.getToken(Sql.BITWISE_OR, 0);
    }
    public BITWISE_XOR(): antlr.TerminalNode | null {
        return this.getToken(Sql.BITWISE_XOR, 0);
    }
    public BITWISE_SHIFT_LEFT(): antlr.TerminalNode | null {
        return this.getToken(Sql.BITWISE_SHIFT_LEFT, 0);
    }
    public BITWISE_SHIFT_RIGHT(): antlr.TerminalNode | null {
        return this.getToken(Sql.BITWISE_SHIFT_RIGHT, 0);
    }
}
export class CurrentInstantFunction0Context extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public currentInstantFunction(): CurrentInstantFunctionContext {
        return this.getRuleContext(0, CurrentInstantFunctionContext)!;
    }
}
export class PgExpandArrayFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public PG_EXPANDARRAY(): antlr.TerminalNode {
        return this.getToken(Sql.PG_EXPANDARRAY, 0)!;
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public expr(): ExprContext | null {
        return this.getRuleContext(0, ExprContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class OverlapsFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public OVERLAPS(): antlr.TerminalNode {
        return this.getToken(Sql.OVERLAPS, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}
export class NumericFactorExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public commonValueExpr(): CommonValueExprContext[];
    public commonValueExpr(i: number): CommonValueExprContext | null;
    public commonValueExpr(i?: number): CommonValueExprContext[] | CommonValueExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CommonValueExprContext);
        }

        return this.getRuleContext(i, CommonValueExprContext);
    }
    public SOLIDUS(): antlr.TerminalNode | null {
        return this.getToken(Sql.SOLIDUS, 0);
    }
    public ASTERISK(): antlr.TerminalNode | null {
        return this.getToken(Sql.ASTERISK, 0);
    }
    public PERCENT(): antlr.TerminalNode | null {
        return this.getToken(Sql.PERCENT, 0);
    }
}
export class TsTzRangeConstructorContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(Sql.COMMA, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public PERIOD(): antlr.TerminalNode | null {
        return this.getToken(Sql.PERIOD, 0);
    }
    public TSTZRANGE(): antlr.TerminalNode | null {
        return this.getToken(Sql.TSTZRANGE, 0);
    }
}
export class PositionFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public POSITION(): antlr.TerminalNode {
        return this.getToken(Sql.POSITION, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public IN(): antlr.TerminalNode {
        return this.getToken(Sql.IN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public USING(): antlr.TerminalNode | null {
        return this.getToken(Sql.USING, 0);
    }
    public charLengthUnits(): CharLengthUnitsContext | null {
        return this.getRuleContext(0, CharLengthUnitsContext);
    }
}
export class UriPortFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public URI_PORT(): antlr.TerminalNode {
        return this.getToken(Sql.URI_PORT, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class UriFragmentFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public URI_FRAGMENT(): antlr.TerminalNode {
        return this.getToken(Sql.URI_FRAGMENT, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class ArrayAccessContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public commonValueExpr(): CommonValueExprContext {
        return this.getRuleContext(0, CommonValueExprContext)!;
    }
    public LBRACK(): antlr.TerminalNode {
        return this.getToken(Sql.LBRACK, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RBRACK(): antlr.TerminalNode {
        return this.getToken(Sql.RBRACK, 0)!;
    }
}
export class ObjectExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public objectConstructor(): ObjectConstructorContext {
        return this.getRuleContext(0, ObjectConstructorContext)!;
    }
}
export class PgGetExprFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public PG_GET_EXPR(): antlr.TerminalNode {
        return this.getToken(Sql.PG_GET_EXPR, 0)!;
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class ExtractFunctionContext extends CommonValueExprContext {
    public _extractSource?: ExprContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public EXTRACT(): antlr.TerminalNode {
        return this.getToken(Sql.EXTRACT, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public extractField(): ExtractFieldContext {
        return this.getRuleContext(0, ExtractFieldContext)!;
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class CastExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CAST(): antlr.TerminalNode {
        return this.getToken(Sql.CAST, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public AS(): antlr.TerminalNode {
        return this.getToken(Sql.AS, 0)!;
    }
    public dataType(): DataTypeContext {
        return this.getRuleContext(0, DataTypeContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class CurrentSchemaFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CURRENT_SCHEMA(): antlr.TerminalNode {
        return this.getToken(Sql.CURRENT_SCHEMA, 0)!;
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class PgSleepForFunctionContext extends CommonValueExprContext {
    public _sleepPeriod?: ExprContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public PG_SLEEP_FOR(): antlr.TerminalNode {
        return this.getToken(Sql.PG_SLEEP_FOR, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class NestOneSubqueryExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NEST_ONE(): antlr.TerminalNode {
        return this.getToken(Sql.NEST_ONE, 0)!;
    }
    public subquery(): SubqueryContext {
        return this.getRuleContext(0, SubqueryContext)!;
    }
}
export class CurrentTimeFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CURRENT_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.CURRENT_TIME, 0)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public precision(): PrecisionContext | null {
        return this.getRuleContext(0, PrecisionContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class PostgresCastExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public commonValueExpr(): CommonValueExprContext {
        return this.getRuleContext(0, CommonValueExprContext)!;
    }
    public PG_CAST(): antlr.TerminalNode {
        return this.getToken(Sql.PG_CAST, 0)!;
    }
    public dataType(): DataTypeContext {
        return this.getRuleContext(0, DataTypeContext)!;
    }
}
export class CurrentSettingFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CURRENT_SETTING(): antlr.TerminalNode {
        return this.getToken(Sql.CURRENT_SETTING, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class PgGetIndexdefFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public PG_GET_INDEXDEF(): antlr.TerminalNode {
        return this.getToken(Sql.PG_GET_INDEXDEF, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}
export class HasTablePrivilegePredicateContext extends CommonValueExprContext {
    public _userString?: ExprContext;
    public _tableString?: ExprContext;
    public _privilegeString?: ExprContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public HAS_TABLE_PRIVILEGE(): antlr.TerminalNode {
        return this.getToken(Sql.HAS_TABLE_PRIVILEGE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
}
export class OverlayFunctionContext extends CommonValueExprContext {
    public _startPosition?: ExprContext;
    public _stringLength?: ExprContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public OVERLAY(): antlr.TerminalNode {
        return this.getToken(Sql.OVERLAY, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public PLACING(): antlr.TerminalNode {
        return this.getToken(Sql.PLACING, 0)!;
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public FOR(): antlr.TerminalNode | null {
        return this.getToken(Sql.FOR, 0);
    }
    public USING(): antlr.TerminalNode | null {
        return this.getToken(Sql.USING, 0);
    }
    public charLengthUnits(): CharLengthUnitsContext | null {
        return this.getRuleContext(0, CharLengthUnitsContext);
    }
}
export class UriHostFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public URI_HOST(): antlr.TerminalNode {
        return this.getToken(Sql.URI_HOST, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class CharacterSubstringFunctionContext extends CommonValueExprContext {
    public _substringSource?: ExprContext;
    public _startPosition?: ExprContext;
    public _stringLength?: ExprContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SUBSTRING(): antlr.TerminalNode {
        return this.getToken(Sql.SUBSTRING, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public FROM(): antlr.TerminalNode | null {
        return this.getToken(Sql.FROM, 0);
    }
    public USING(): antlr.TerminalNode | null {
        return this.getToken(Sql.USING, 0);
    }
    public charLengthUnits(): CharLengthUnitsContext | null {
        return this.getRuleContext(0, CharLengthUnitsContext);
    }
    public FOR(): antlr.TerminalNode | null {
        return this.getToken(Sql.FOR, 0);
    }
}
export class NullIfExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NULLIF(): antlr.TerminalNode {
        return this.getToken(Sql.NULLIF, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(Sql.COMMA, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class HasAnyColumnPrivilegePredicateContext extends CommonValueExprContext {
    public _userString?: ExprContext;
    public _tableString?: ExprContext;
    public _privilegeString?: ExprContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public HAS_ANY_COLUMN_PRIVILEGE(): antlr.TerminalNode {
        return this.getToken(Sql.HAS_ANY_COLUMN_PRIVILEGE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
}
export class ArrayExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public arrayValueConstructor(): ArrayValueConstructorContext {
        return this.getRuleContext(0, ArrayValueConstructorContext)!;
    }
}
export class PostgresGetUserByIdFunctionContext extends CommonValueExprContext {
    public _relOwner?: ColumnReferenceContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public PG_GET_USERBYID(): antlr.TerminalNode {
        return this.getToken(Sql.PG_GET_USERBYID, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public columnReference(): ColumnReferenceContext {
        return this.getRuleContext(0, ColumnReferenceContext)!;
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
}
export class TrimFunctionContext extends CommonValueExprContext {
    public _trimCharacter?: ExprContext;
    public _trimSource?: ExprContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TRIM(): antlr.TerminalNode {
        return this.getToken(Sql.TRIM, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public FROM(): antlr.TerminalNode | null {
        return this.getToken(Sql.FROM, 0);
    }
    public trimSpecification(): TrimSpecificationContext | null {
        return this.getRuleContext(0, TrimSpecificationContext);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
}
export class DateBinFunctionContext extends CommonValueExprContext {
    public _dateBinSource?: ExprContext;
    public _dateBinOrigin?: ExprContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DATE_BIN(): antlr.TerminalNode {
        return this.getToken(Sql.DATE_BIN, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public intervalLiteral(): IntervalLiteralContext {
        return this.getRuleContext(0, IntervalLiteralContext)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
}
export class NumericBitwiseNotExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TILDE(): antlr.TerminalNode {
        return this.getToken(Sql.TILDE, 0)!;
    }
    public commonValueExpr(): CommonValueExprContext {
        return this.getRuleContext(0, CommonValueExprContext)!;
    }
}
export class ColumnExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public columnReference(): ColumnReferenceContext {
        return this.getRuleContext(0, ColumnReferenceContext)!;
    }
}
export class ExistsPredicateContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public EXISTS(): antlr.TerminalNode {
        return this.getToken(Sql.EXISTS, 0)!;
    }
    public subquery(): SubqueryContext {
        return this.getRuleContext(0, SubqueryContext)!;
    }
}
export class ReplaceFunctionContext extends CommonValueExprContext {
    public _source?: ExprContext;
    public _pattern?: ExprContext;
    public _replacement?: ExprContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public REPLACE(): antlr.TerminalNode {
        return this.getToken(Sql.REPLACE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
}
export class UriSchemeFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public URI_SCHEME(): antlr.TerminalNode {
        return this.getToken(Sql.URI_SCHEME, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class NestedWindowFunctionExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public nestedWindowFunction(): NestedWindowFunctionContext {
        return this.getRuleContext(0, NestedWindowFunctionContext)!;
    }
}
export class UriPathFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public URI_PATH(): antlr.TerminalNode {
        return this.getToken(Sql.URI_PATH, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class CurrentUserFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CURRENT_USER(): antlr.TerminalNode {
        return this.getToken(Sql.CURRENT_USER, 0)!;
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
}
export class LiteralExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public literal(): LiteralContext {
        return this.getRuleContext(0, LiteralContext)!;
    }
}
export class SimpleCaseExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CASE(): antlr.TerminalNode {
        return this.getToken(Sql.CASE, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public END(): antlr.TerminalNode {
        return this.getToken(Sql.END, 0)!;
    }
    public simpleWhenClause(): SimpleWhenClauseContext[];
    public simpleWhenClause(i: number): SimpleWhenClauseContext | null;
    public simpleWhenClause(i?: number): SimpleWhenClauseContext[] | SimpleWhenClauseContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SimpleWhenClauseContext);
        }

        return this.getRuleContext(i, SimpleWhenClauseContext);
    }
    public elseClause(): ElseClauseContext | null {
        return this.getRuleContext(0, ElseClauseContext);
    }
}
export class FunctionCallContext extends CommonValueExprContext {
    public _schemaName?: IdentifierContext;
    public _fn?: IdentifierContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}
export class JsonAccessExprContext extends CommonValueExprContext {
    public _obj?: CommonValueExprContext;
    public _op?: Token | null;
    public _arg?: CommonValueExprContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public commonValueExpr(): CommonValueExprContext[];
    public commonValueExpr(i: number): CommonValueExprContext | null;
    public commonValueExpr(i?: number): CommonValueExprContext[] | CommonValueExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CommonValueExprContext);
        }

        return this.getRuleContext(i, CommonValueExprContext);
    }
    public JSON_ARROW(): antlr.TerminalNode | null {
        return this.getToken(Sql.JSON_ARROW, 0);
    }
    public JSON_ARROW_TEXT(): antlr.TerminalNode | null {
        return this.getToken(Sql.JSON_ARROW_TEXT, 0);
    }
    public JSON_PATH(): antlr.TerminalNode | null {
        return this.getToken(Sql.JSON_PATH, 0);
    }
    public JSON_PATH_TEXT(): antlr.TerminalNode | null {
        return this.getToken(Sql.JSON_PATH_TEXT, 0);
    }
}
export class PostgresVersionFunctionContext extends CommonValueExprContext {
    public _schemaName?: IdentifierContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public VERSION(): antlr.TerminalNode {
        return this.getToken(Sql.VERSION, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
}
export class CurrentCatalogFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CURRENT_CATALOG(): antlr.TerminalNode {
        return this.getToken(Sql.CURRENT_CATALOG, 0)!;
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class ParamExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public parameterSpecification(): ParameterSpecificationContext {
        return this.getRuleContext(0, ParameterSpecificationContext)!;
    }
}
export class CoalesceExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public COALESCE(): antlr.TerminalNode {
        return this.getToken(Sql.COALESCE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}
export class UriQueryFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public URI_QUERY(): antlr.TerminalNode {
        return this.getToken(Sql.URI_QUERY, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class HasSchemaPrivilegePredicateContext extends CommonValueExprContext {
    public _userString?: ExprContext;
    public _schemaString?: ExprContext;
    public _privilegeString?: ExprContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public HAS_SCHEMA_PRIVILEGE(): antlr.TerminalNode {
        return this.getToken(Sql.HAS_SCHEMA_PRIVILEGE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
}
export class UriUserInfoFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public URI_USER_INFO(): antlr.TerminalNode {
        return this.getToken(Sql.URI_USER_INFO, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class RegexpReplaceFunctionContext extends CommonValueExprContext {
    public _source?: ExprContext;
    public _pattern?: CharacterStringContext;
    public _replacement?: CharacterStringContext;
    public _start?: IntegerLiteralContext;
    public _n?: IntegerLiteralContext;
    public _flags?: CharacterStringContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public REGEXP_REPLACE(): antlr.TerminalNode {
        return this.getToken(Sql.REGEXP_REPLACE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public characterString(): CharacterStringContext[];
    public characterString(i: number): CharacterStringContext | null;
    public characterString(i?: number): CharacterStringContext[] | CharacterStringContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CharacterStringContext);
        }

        return this.getRuleContext(i, CharacterStringContext);
    }
    public integerLiteral(): IntegerLiteralContext[];
    public integerLiteral(i: number): IntegerLiteralContext | null;
    public integerLiteral(i?: number): IntegerLiteralContext[] | IntegerLiteralContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IntegerLiteralContext);
        }

        return this.getRuleContext(i, IntegerLiteralContext);
    }
}
export class DateTruncFunctionContext extends CommonValueExprContext {
    public _dateTruncSource?: ExprContext;
    public _dateTruncTimeZone?: CharacterStringContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public DATE_TRUNC(): antlr.TerminalNode {
        return this.getToken(Sql.DATE_TRUNC, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public dateTruncPrecision(): DateTruncPrecisionContext {
        return this.getRuleContext(0, DateTruncPrecisionContext)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public characterString(): CharacterStringContext | null {
        return this.getRuleContext(0, CharacterStringContext);
    }
}
export class NumericTermExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public commonValueExpr(): CommonValueExprContext[];
    public commonValueExpr(i: number): CommonValueExprContext | null;
    public commonValueExpr(i?: number): CommonValueExprContext[] | CommonValueExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CommonValueExprContext);
        }

        return this.getRuleContext(i, CommonValueExprContext);
    }
    public PLUS(): antlr.TerminalNode | null {
        return this.getToken(Sql.PLUS, 0);
    }
    public MINUS(): antlr.TerminalNode | null {
        return this.getToken(Sql.MINUS, 0);
    }
}
export class SearchedCaseExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CASE(): antlr.TerminalNode {
        return this.getToken(Sql.CASE, 0)!;
    }
    public END(): antlr.TerminalNode {
        return this.getToken(Sql.END, 0)!;
    }
    public searchedWhenClause(): SearchedWhenClauseContext[];
    public searchedWhenClause(i: number): SearchedWhenClauseContext | null;
    public searchedWhenClause(i?: number): SearchedWhenClauseContext[] | SearchedWhenClauseContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SearchedWhenClauseContext);
        }

        return this.getRuleContext(i, SearchedWhenClauseContext);
    }
    public elseClause(): ElseClauseContext | null {
        return this.getRuleContext(0, ElseClauseContext);
    }
}
export class LocalTimeFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LOCAL_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.LOCAL_TIME, 0)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public precision(): PrecisionContext | null {
        return this.getRuleContext(0, PrecisionContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class WrappedExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class CharacterLengthFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public CHAR_LENGTH(): antlr.TerminalNode | null {
        return this.getToken(Sql.CHAR_LENGTH, 0);
    }
    public CHARACTER_LENGTH(): antlr.TerminalNode | null {
        return this.getToken(Sql.CHARACTER_LENGTH, 0);
    }
    public USING(): antlr.TerminalNode | null {
        return this.getToken(Sql.USING, 0);
    }
    public charLengthUnits(): CharLengthUnitsContext | null {
        return this.getRuleContext(0, CharLengthUnitsContext);
    }
}
export class PgSleepFunctionContext extends CommonValueExprContext {
    public _sleepSeconds?: ExprContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public PG_SLEEP(): antlr.TerminalNode {
        return this.getToken(Sql.PG_SLEEP, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class RangeBinsFunctionContext extends CommonValueExprContext {
    public _rangeBinsSource?: ExprContext;
    public _dateBinOrigin?: ExprContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public RANGE_BINS(): antlr.TerminalNode {
        return this.getToken(Sql.RANGE_BINS, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public intervalLiteral(): IntervalLiteralContext {
        return this.getRuleContext(0, IntervalLiteralContext)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
}
export class GenerateSeriesFunctionContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public generateSeries(): GenerateSeriesContext {
        return this.getRuleContext(0, GenerateSeriesContext)!;
    }
}
export class PostgresTableIsVisibleFunctionContext extends CommonValueExprContext {
    public _columnOid?: ColumnReferenceContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public PG_TABLE_IS_VISIBLE(): antlr.TerminalNode {
        return this.getToken(Sql.PG_TABLE_IS_VISIBLE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public columnReference(): ColumnReferenceContext {
        return this.getRuleContext(0, ColumnReferenceContext)!;
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
}
export class UnaryPlusExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public PLUS(): antlr.TerminalNode {
        return this.getToken(Sql.PLUS, 0)!;
    }
    public commonValueExpr(): CommonValueExprContext {
        return this.getRuleContext(0, CommonValueExprContext)!;
    }
}
export class FieldAccessContext extends CommonValueExprContext {
    public _fieldName?: IdentifierContext;
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public commonValueExpr(): CommonValueExprContext {
        return this.getRuleContext(0, CommonValueExprContext)!;
    }
    public DOT(): antlr.TerminalNode {
        return this.getToken(Sql.DOT, 0)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
}
export class NestManySubqueryExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NEST_MANY(): antlr.TerminalNode {
        return this.getToken(Sql.NEST_MANY, 0)!;
    }
    public subquery(): SubqueryContext {
        return this.getRuleContext(0, SubqueryContext)!;
    }
}
export class ScalarSubqueryExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public subquery(): SubqueryContext {
        return this.getRuleContext(0, SubqueryContext)!;
    }
}
export class WindowFunctionExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public windowFunctionType(): WindowFunctionTypeContext {
        return this.getRuleContext(0, WindowFunctionTypeContext)!;
    }
    public OVER(): antlr.TerminalNode {
        return this.getToken(Sql.OVER, 0)!;
    }
    public windowNameOrSpecification(): WindowNameOrSpecificationContext {
        return this.getRuleContext(0, WindowNameOrSpecificationContext)!;
    }
}
export class UnaryMinusExprContext extends CommonValueExprContext {
    public constructor(ctx: CommonValueExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public MINUS(): antlr.TerminalNode {
        return this.getToken(Sql.MINUS, 0)!;
    }
    public commonValueExpr(): CommonValueExprContext {
        return this.getRuleContext(0, CommonValueExprContext)!;
    }
}


export class CurrentInstantFunctionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_currentInstantFunction;
    }
    public override copyFrom(ctx: CurrentInstantFunctionContext): void {
        super.copyFrom(ctx);
    }
}
export class SnapshotTokenFunctionContext extends CurrentInstantFunctionContext {
    public constructor(ctx: CurrentInstantFunctionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SNAPSHOT_TOKEN(): antlr.TerminalNode {
        return this.getToken(Sql.SNAPSHOT_TOKEN, 0)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class CurrentTimestampFunctionContext extends CurrentInstantFunctionContext {
    public constructor(ctx: CurrentInstantFunctionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CURRENT_TIMESTAMP(): antlr.TerminalNode | null {
        return this.getToken(Sql.CURRENT_TIMESTAMP, 0);
    }
    public NOW(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOW, 0);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
    public precision(): PrecisionContext | null {
        return this.getRuleContext(0, PrecisionContext);
    }
}
export class LocalTimestampFunctionContext extends CurrentInstantFunctionContext {
    public constructor(ctx: CurrentInstantFunctionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LOCAL_TIMESTAMP(): antlr.TerminalNode {
        return this.getToken(Sql.LOCAL_TIMESTAMP, 0)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public precision(): PrecisionContext | null {
        return this.getRuleContext(0, PrecisionContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class CurrentDateFunctionContext extends CurrentInstantFunctionContext {
    public constructor(ctx: CurrentInstantFunctionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CURRENT_DATE(): antlr.TerminalNode {
        return this.getToken(Sql.CURRENT_DATE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class LocalDateFunctionContext extends CurrentInstantFunctionContext {
    public constructor(ctx: CurrentInstantFunctionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LOCAL_DATE(): antlr.TerminalNode {
        return this.getToken(Sql.LOCAL_DATE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}


export class BooleanValueContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public TRUE(): antlr.TerminalNode | null {
        return this.getToken(Sql.TRUE, 0);
    }
    public FALSE(): antlr.TerminalNode | null {
        return this.getToken(Sql.FALSE, 0);
    }
    public UNKNOWN(): antlr.TerminalNode | null {
        return this.getToken(Sql.UNKNOWN, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_booleanValue;
    }
}


export class ObjectConstructorContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
    public RECORD(): antlr.TerminalNode | null {
        return this.getToken(Sql.RECORD, 0);
    }
    public OBJECT(): antlr.TerminalNode | null {
        return this.getToken(Sql.OBJECT, 0);
    }
    public objectNameAndValue(): ObjectNameAndValueContext[];
    public objectNameAndValue(i: number): ObjectNameAndValueContext | null;
    public objectNameAndValue(i?: number): ObjectNameAndValueContext[] | ObjectNameAndValueContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ObjectNameAndValueContext);
        }

        return this.getRuleContext(i, ObjectNameAndValueContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public LBRACE(): antlr.TerminalNode | null {
        return this.getToken(Sql.LBRACE, 0);
    }
    public RBRACE(): antlr.TerminalNode | null {
        return this.getToken(Sql.RBRACE, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_objectConstructor;
    }
}


export class ObjectNameAndValueContext extends antlr.ParserRuleContext {
    public _objectName?: IdentifierContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(Sql.COLON, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_objectNameAndValue;
    }
}


export class ParameterSpecificationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_parameterSpecification;
    }
    public override copyFrom(ctx: ParameterSpecificationContext): void {
        super.copyFrom(ctx);
    }
}
export class PostgresParameterContext extends ParameterSpecificationContext {
    public constructor(ctx: ParameterSpecificationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public POSTGRES_PARAMETER_SPECIFICATION(): antlr.TerminalNode {
        return this.getToken(Sql.POSTGRES_PARAMETER_SPECIFICATION, 0)!;
    }
}
export class DynamicParameterContext extends ParameterSpecificationContext {
    public constructor(ctx: ParameterSpecificationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public QUESTION(): antlr.TerminalNode {
        return this.getToken(Sql.QUESTION, 0)!;
    }
}


export class StaticExprContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_staticExpr;
    }
    public override copyFrom(ctx: StaticExprContext): void {
        super.copyFrom(ctx);
    }
}
export class StaticLiteralContext extends StaticExprContext {
    public constructor(ctx: StaticExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public literal(): LiteralContext {
        return this.getRuleContext(0, LiteralContext)!;
    }
}
export class StaticParamContext extends StaticExprContext {
    public constructor(ctx: StaticExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public parameterSpecification(): ParameterSpecificationContext {
        return this.getRuleContext(0, ParameterSpecificationContext)!;
    }
}


export class ColumnReferenceContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifierChain(): IdentifierChainContext {
        return this.getRuleContext(0, IdentifierChainContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_columnReference;
    }
}


export class GenerateSeriesContext extends antlr.ParserRuleContext {
    public _fn?: Token | null;
    public _seriesStart?: ExprContext;
    public _seriesEnd?: ExprContext;
    public _seriesStep?: ExprContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public GENERATE_SERIES(): antlr.TerminalNode | null {
        return this.getToken(Sql.GENERATE_SERIES, 0);
    }
    public RANGE(): antlr.TerminalNode | null {
        return this.getToken(Sql.RANGE, 0);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOT, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_generateSeries;
    }
}


export class WindowFunctionTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowFunctionType;
    }
    public override copyFrom(ctx: WindowFunctionTypeContext): void {
        super.copyFrom(ctx);
    }
}
export class NtileWindowFunctionContext extends WindowFunctionTypeContext {
    public constructor(ctx: WindowFunctionTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NTILE(): antlr.TerminalNode {
        return this.getToken(Sql.NTILE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public numberOfTiles(): NumberOfTilesContext {
        return this.getRuleContext(0, NumberOfTilesContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class FirstOrLastValueWindowFunctionContext extends WindowFunctionTypeContext {
    public constructor(ctx: WindowFunctionTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public firstOrLastValue(): FirstOrLastValueContext {
        return this.getRuleContext(0, FirstOrLastValueContext)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public nullTreatment(): NullTreatmentContext | null {
        return this.getRuleContext(0, NullTreatmentContext);
    }
}
export class LeadOrLagWindowFunctionContext extends WindowFunctionTypeContext {
    public _leadOrLagExtent?: ExprContext;
    public _offset?: Token | null;
    public _defaultExpression?: ExprContext;
    public constructor(ctx: WindowFunctionTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public LEAD(): antlr.TerminalNode | null {
        return this.getToken(Sql.LEAD, 0);
    }
    public LAG(): antlr.TerminalNode | null {
        return this.getToken(Sql.LAG, 0);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public nullTreatment(): NullTreatmentContext | null {
        return this.getRuleContext(0, NullTreatmentContext);
    }
    public UNSIGNED_INTEGER(): antlr.TerminalNode | null {
        return this.getToken(Sql.UNSIGNED_INTEGER, 0);
    }
}
export class RankWindowFunctionContext extends WindowFunctionTypeContext {
    public constructor(ctx: WindowFunctionTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public rankFunctionType(): RankFunctionTypeContext {
        return this.getRuleContext(0, RankFunctionTypeContext)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class NthValueWindowFunctionContext extends WindowFunctionTypeContext {
    public constructor(ctx: WindowFunctionTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NTH_VALUE(): antlr.TerminalNode {
        return this.getToken(Sql.NTH_VALUE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(Sql.COMMA, 0)!;
    }
    public nthRow(): NthRowContext {
        return this.getRuleContext(0, NthRowContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public fromFirstOrLast(): FromFirstOrLastContext | null {
        return this.getRuleContext(0, FromFirstOrLastContext);
    }
    public nullTreatment(): NullTreatmentContext | null {
        return this.getRuleContext(0, NullTreatmentContext);
    }
}
export class AggregateWindowFunctionContext extends WindowFunctionTypeContext {
    public constructor(ctx: WindowFunctionTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public aggregateFunction(): AggregateFunctionContext {
        return this.getRuleContext(0, AggregateFunctionContext)!;
    }
}
export class RowNumberWindowFunctionContext extends WindowFunctionTypeContext {
    public constructor(ctx: WindowFunctionTypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ROW_NUMBER(): antlr.TerminalNode {
        return this.getToken(Sql.ROW_NUMBER, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}


export class RankFunctionTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public RANK(): antlr.TerminalNode | null {
        return this.getToken(Sql.RANK, 0);
    }
    public DENSE_RANK(): antlr.TerminalNode | null {
        return this.getToken(Sql.DENSE_RANK, 0);
    }
    public PERCENT_RANK(): antlr.TerminalNode | null {
        return this.getToken(Sql.PERCENT_RANK, 0);
    }
    public CUME_DIST(): antlr.TerminalNode | null {
        return this.getToken(Sql.CUME_DIST, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_rankFunctionType;
    }
}


export class NumberOfTilesContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNSIGNED_INTEGER(): antlr.TerminalNode | null {
        return this.getToken(Sql.UNSIGNED_INTEGER, 0);
    }
    public parameterSpecification(): ParameterSpecificationContext | null {
        return this.getRuleContext(0, ParameterSpecificationContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_numberOfTiles;
    }
}


export class NullTreatmentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_nullTreatment;
    }
    public override copyFrom(ctx: NullTreatmentContext): void {
        super.copyFrom(ctx);
    }
}
export class RespectNullsContext extends NullTreatmentContext {
    public constructor(ctx: NullTreatmentContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public RESPECT(): antlr.TerminalNode {
        return this.getToken(Sql.RESPECT, 0)!;
    }
    public NULLS(): antlr.TerminalNode {
        return this.getToken(Sql.NULLS, 0)!;
    }
}
export class IgnoreNullsContext extends NullTreatmentContext {
    public constructor(ctx: NullTreatmentContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public IGNORE(): antlr.TerminalNode {
        return this.getToken(Sql.IGNORE, 0)!;
    }
    public NULLS(): antlr.TerminalNode {
        return this.getToken(Sql.NULLS, 0)!;
    }
}


export class FirstOrLastValueContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FIRST_VALUE(): antlr.TerminalNode | null {
        return this.getToken(Sql.FIRST_VALUE, 0);
    }
    public LAST_VALUE(): antlr.TerminalNode | null {
        return this.getToken(Sql.LAST_VALUE, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_firstOrLastValue;
    }
}


export class NthRowContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNSIGNED_INTEGER(): antlr.TerminalNode | null {
        return this.getToken(Sql.UNSIGNED_INTEGER, 0);
    }
    public QUESTION(): antlr.TerminalNode | null {
        return this.getToken(Sql.QUESTION, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_nthRow;
    }
}


export class FromFirstOrLastContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_fromFirstOrLast;
    }
    public override copyFrom(ctx: FromFirstOrLastContext): void {
        super.copyFrom(ctx);
    }
}
export class FromLastContext extends FromFirstOrLastContext {
    public constructor(ctx: FromFirstOrLastContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public LAST(): antlr.TerminalNode {
        return this.getToken(Sql.LAST, 0)!;
    }
}
export class FromFirstContext extends FromFirstOrLastContext {
    public constructor(ctx: FromFirstOrLastContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public FIRST(): antlr.TerminalNode {
        return this.getToken(Sql.FIRST, 0)!;
    }
}


export class WindowNameOrSpecificationContext extends antlr.ParserRuleContext {
    public _windowName?: IdentifierContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public windowSpecification(): WindowSpecificationContext | null {
        return this.getRuleContext(0, WindowSpecificationContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowNameOrSpecification;
    }
}


export class NestedWindowFunctionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_nestedWindowFunction;
    }
    public override copyFrom(ctx: NestedWindowFunctionContext): void {
        super.copyFrom(ctx);
    }
}
export class ValueOfExprAtRowContext extends NestedWindowFunctionContext {
    public constructor(ctx: NestedWindowFunctionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public VALUE_OF(): antlr.TerminalNode {
        return this.getToken(Sql.VALUE_OF, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public AT(): antlr.TerminalNode {
        return this.getToken(Sql.AT, 0)!;
    }
    public rowMarkerExpression(): RowMarkerExpressionContext {
        return this.getRuleContext(0, RowMarkerExpressionContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public COMMA(): antlr.TerminalNode | null {
        return this.getToken(Sql.COMMA, 0);
    }
    public valueOfDefaultValue(): ValueOfDefaultValueContext | null {
        return this.getRuleContext(0, ValueOfDefaultValueContext);
    }
}
export class NestedRowNumberFunctionContext extends NestedWindowFunctionContext {
    public constructor(ctx: NestedWindowFunctionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ROW_NUMBER(): antlr.TerminalNode {
        return this.getToken(Sql.ROW_NUMBER, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public rowMarker(): RowMarkerContext {
        return this.getRuleContext(0, RowMarkerContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}


export class RowMarkerContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public BEGIN_PARTITION(): antlr.TerminalNode | null {
        return this.getToken(Sql.BEGIN_PARTITION, 0);
    }
    public BEGIN_FRAME(): antlr.TerminalNode | null {
        return this.getToken(Sql.BEGIN_FRAME, 0);
    }
    public CURRENT_ROW(): antlr.TerminalNode | null {
        return this.getToken(Sql.CURRENT_ROW, 0);
    }
    public FRAME_ROW(): antlr.TerminalNode | null {
        return this.getToken(Sql.FRAME_ROW, 0);
    }
    public END_FRAME(): antlr.TerminalNode | null {
        return this.getToken(Sql.END_FRAME, 0);
    }
    public END_PARTITION(): antlr.TerminalNode | null {
        return this.getToken(Sql.END_PARTITION, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_rowMarker;
    }
}


export class RowMarkerExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public rowMarker(): RowMarkerContext {
        return this.getRuleContext(0, RowMarkerContext)!;
    }
    public rowMarkerDelta(): RowMarkerDeltaContext | null {
        return this.getRuleContext(0, RowMarkerDeltaContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_rowMarkerExpression;
    }
}


export class RowMarkerDeltaContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public PLUS(): antlr.TerminalNode | null {
        return this.getToken(Sql.PLUS, 0);
    }
    public rowMarkerOffset(): RowMarkerOffsetContext {
        return this.getRuleContext(0, RowMarkerOffsetContext)!;
    }
    public MINUS(): antlr.TerminalNode | null {
        return this.getToken(Sql.MINUS, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_rowMarkerDelta;
    }
}


export class RowMarkerOffsetContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNSIGNED_INTEGER(): antlr.TerminalNode | null {
        return this.getToken(Sql.UNSIGNED_INTEGER, 0);
    }
    public QUESTION(): antlr.TerminalNode | null {
        return this.getToken(Sql.QUESTION, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_rowMarkerOffset;
    }
}


export class ValueOfDefaultValueContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_valueOfDefaultValue;
    }
}


export class SimpleWhenClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WHEN(): antlr.TerminalNode {
        return this.getToken(Sql.WHEN, 0)!;
    }
    public whenOperandList(): WhenOperandListContext {
        return this.getRuleContext(0, WhenOperandListContext)!;
    }
    public THEN(): antlr.TerminalNode {
        return this.getToken(Sql.THEN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_simpleWhenClause;
    }
}


export class SearchedWhenClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WHEN(): antlr.TerminalNode {
        return this.getToken(Sql.WHEN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public THEN(): antlr.TerminalNode {
        return this.getToken(Sql.THEN, 0)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_searchedWhenClause;
    }
}


export class ElseClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ELSE(): antlr.TerminalNode {
        return this.getToken(Sql.ELSE, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_elseClause;
    }
}


export class WhenOperandListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public whenOperand(): WhenOperandContext[];
    public whenOperand(i: number): WhenOperandContext | null;
    public whenOperand(i?: number): WhenOperandContext[] | WhenOperandContext | null {
        if (i === undefined) {
            return this.getRuleContexts(WhenOperandContext);
        }

        return this.getRuleContext(i, WhenOperandContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_whenOperandList;
    }
}


export class WhenOperandContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public predicatePart2(): PredicatePart2Context | null {
        return this.getRuleContext(0, PredicatePart2Context);
    }
    public expr(): ExprContext | null {
        return this.getRuleContext(0, ExprContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_whenOperand;
    }
}


export class ExtractFieldContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public primaryDatetimeField(): PrimaryDatetimeFieldContext | null {
        return this.getRuleContext(0, PrimaryDatetimeFieldContext);
    }
    public timeZoneField(): TimeZoneFieldContext | null {
        return this.getRuleContext(0, TimeZoneFieldContext);
    }
    public pgExtractField(): PgExtractFieldContext | null {
        return this.getRuleContext(0, PgExtractFieldContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_extractField;
    }
}


export class PrimaryDatetimeFieldContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public nonSecondPrimaryDatetimeField(): NonSecondPrimaryDatetimeFieldContext | null {
        return this.getRuleContext(0, NonSecondPrimaryDatetimeFieldContext);
    }
    public SECOND(): antlr.TerminalNode | null {
        return this.getToken(Sql.SECOND, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_primaryDatetimeField;
    }
}


export class TimeZoneFieldContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public TIMEZONE_HOUR(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIMEZONE_HOUR, 0);
    }
    public TIMEZONE_MINUTE(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIMEZONE_MINUTE, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_timeZoneField;
    }
}


export class PgExtractFieldContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public DOW(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOW, 0);
    }
    public ISODOW(): antlr.TerminalNode | null {
        return this.getToken(Sql.ISODOW, 0);
    }
    public DOY(): antlr.TerminalNode | null {
        return this.getToken(Sql.DOY, 0);
    }
    public WEEK(): antlr.TerminalNode | null {
        return this.getToken(Sql.WEEK, 0);
    }
    public QUARTER(): antlr.TerminalNode | null {
        return this.getToken(Sql.QUARTER, 0);
    }
    public EPOCH(): antlr.TerminalNode | null {
        return this.getToken(Sql.EPOCH, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_pgExtractField;
    }
}


export class TrimSpecificationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LEADING(): antlr.TerminalNode | null {
        return this.getToken(Sql.LEADING, 0);
    }
    public TRAILING(): antlr.TerminalNode | null {
        return this.getToken(Sql.TRAILING, 0);
    }
    public BOTH(): antlr.TerminalNode | null {
        return this.getToken(Sql.BOTH, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_trimSpecification;
    }
}


export class DateTruncPrecisionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public MILLENNIUM(): antlr.TerminalNode | null {
        return this.getToken(Sql.MILLENNIUM, 0);
    }
    public CENTURY(): antlr.TerminalNode | null {
        return this.getToken(Sql.CENTURY, 0);
    }
    public DECADE(): antlr.TerminalNode | null {
        return this.getToken(Sql.DECADE, 0);
    }
    public YEAR(): antlr.TerminalNode | null {
        return this.getToken(Sql.YEAR, 0);
    }
    public QUARTER(): antlr.TerminalNode | null {
        return this.getToken(Sql.QUARTER, 0);
    }
    public MONTH(): antlr.TerminalNode | null {
        return this.getToken(Sql.MONTH, 0);
    }
    public WEEK(): antlr.TerminalNode | null {
        return this.getToken(Sql.WEEK, 0);
    }
    public DAY(): antlr.TerminalNode | null {
        return this.getToken(Sql.DAY, 0);
    }
    public HOUR(): antlr.TerminalNode | null {
        return this.getToken(Sql.HOUR, 0);
    }
    public MINUTE(): antlr.TerminalNode | null {
        return this.getToken(Sql.MINUTE, 0);
    }
    public SECOND(): antlr.TerminalNode | null {
        return this.getToken(Sql.SECOND, 0);
    }
    public MILLISECOND(): antlr.TerminalNode | null {
        return this.getToken(Sql.MILLISECOND, 0);
    }
    public MICROSECOND(): antlr.TerminalNode | null {
        return this.getToken(Sql.MICROSECOND, 0);
    }
    public NANOSECOND(): antlr.TerminalNode | null {
        return this.getToken(Sql.NANOSECOND, 0);
    }
    public characterString(): CharacterStringContext | null {
        return this.getRuleContext(0, CharacterStringContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_dateTruncPrecision;
    }
}


export class ArrayValueConstructorContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_arrayValueConstructor;
    }
    public override copyFrom(ctx: ArrayValueConstructorContext): void {
        super.copyFrom(ctx);
    }
}
export class ArrayValueConstructorByEnumerationContext extends ArrayValueConstructorContext {
    public constructor(ctx: ArrayValueConstructorContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LBRACK(): antlr.TerminalNode {
        return this.getToken(Sql.LBRACK, 0)!;
    }
    public RBRACK(): antlr.TerminalNode {
        return this.getToken(Sql.RBRACK, 0)!;
    }
    public ARRAY(): antlr.TerminalNode | null {
        return this.getToken(Sql.ARRAY, 0);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}
export class ArrayValueConstructorByQueryContext extends ArrayValueConstructorContext {
    public constructor(ctx: ArrayValueConstructorContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ARRAY(): antlr.TerminalNode {
        return this.getToken(Sql.ARRAY, 0)!;
    }
    public subquery(): SubqueryContext {
        return this.getRuleContext(0, SubqueryContext)!;
    }
}


export class RowValueConstructorContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_rowValueConstructor;
    }
    public override copyFrom(ctx: RowValueConstructorContext): void {
        super.copyFrom(ctx);
    }
}
export class SingleExprRowConstructorContext extends RowValueConstructorContext {
    public constructor(ctx: RowValueConstructorContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class MultiExprRowConstructorContext extends RowValueConstructorContext {
    public constructor(ctx: RowValueConstructorContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ROW(): antlr.TerminalNode | null {
        return this.getToken(Sql.ROW, 0);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}


export class RowValueListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public rowValueConstructor(): RowValueConstructorContext[];
    public rowValueConstructor(i: number): RowValueConstructorContext | null;
    public rowValueConstructor(i?: number): RowValueConstructorContext[] | RowValueConstructorContext | null {
        if (i === undefined) {
            return this.getRuleContexts(RowValueConstructorContext);
        }

        return this.getRuleContext(i, RowValueConstructorContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_rowValueList;
    }
}


export class TableValueConstructorContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public VALUES(): antlr.TerminalNode {
        return this.getToken(Sql.VALUES, 0)!;
    }
    public rowValueList(): RowValueListContext {
        return this.getRuleContext(0, RowValueListContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_tableValueConstructor;
    }
}


export class RecordValueConstructorContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_recordValueConstructor;
    }
    public override copyFrom(ctx: RecordValueConstructorContext): void {
        super.copyFrom(ctx);
    }
}
export class ObjectRecordContext extends RecordValueConstructorContext {
    public constructor(ctx: RecordValueConstructorContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public objectConstructor(): ObjectConstructorContext {
        return this.getRuleContext(0, ObjectConstructorContext)!;
    }
}
export class ParameterRecordContext extends RecordValueConstructorContext {
    public constructor(ctx: RecordValueConstructorContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public parameterSpecification(): ParameterSpecificationContext {
        return this.getRuleContext(0, ParameterSpecificationContext)!;
    }
}


export class RecordsValueListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public recordValueConstructor(): RecordValueConstructorContext[];
    public recordValueConstructor(i: number): RecordValueConstructorContext | null;
    public recordValueConstructor(i?: number): RecordValueConstructorContext[] | RecordValueConstructorContext | null {
        if (i === undefined) {
            return this.getRuleContexts(RecordValueConstructorContext);
        }

        return this.getRuleContext(i, RecordValueConstructorContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_recordsValueList;
    }
}


export class RecordsValueConstructorContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public RECORDS(): antlr.TerminalNode {
        return this.getToken(Sql.RECORDS, 0)!;
    }
    public recordsValueList(): RecordsValueListContext {
        return this.getRuleContext(0, RecordsValueListContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_recordsValueConstructor;
    }
}


export class FromClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public tableReference(): TableReferenceContext[];
    public tableReference(i: number): TableReferenceContext | null;
    public tableReference(i?: number): TableReferenceContext[] | TableReferenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TableReferenceContext);
        }

        return this.getRuleContext(i, TableReferenceContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_fromClause;
    }
}


export class TableReferenceContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_tableReference;
    }
    public override copyFrom(ctx: TableReferenceContext): void {
        super.copyFrom(ctx);
    }
}
export class LateralDerivedTableContext extends TableReferenceContext {
    public constructor(ctx: TableReferenceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LATERAL(): antlr.TerminalNode {
        return this.getToken(Sql.LATERAL, 0)!;
    }
    public subquery(): SubqueryContext {
        return this.getRuleContext(0, SubqueryContext)!;
    }
    public tableAlias(): TableAliasContext {
        return this.getRuleContext(0, TableAliasContext)!;
    }
    public tableProjection(): TableProjectionContext | null {
        return this.getRuleContext(0, TableProjectionContext);
    }
}
export class DerivedTableContext extends TableReferenceContext {
    public constructor(ctx: TableReferenceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public subquery(): SubqueryContext {
        return this.getRuleContext(0, SubqueryContext)!;
    }
    public tableAlias(): TableAliasContext {
        return this.getRuleContext(0, TableAliasContext)!;
    }
    public tableProjection(): TableProjectionContext | null {
        return this.getRuleContext(0, TableProjectionContext);
    }
}
export class GenerateSeriesTableContext extends TableReferenceContext {
    public constructor(ctx: TableReferenceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public generateSeries(): GenerateSeriesContext {
        return this.getRuleContext(0, GenerateSeriesContext)!;
    }
    public tableAlias(): TableAliasContext {
        return this.getRuleContext(0, TableAliasContext)!;
    }
    public withOrdinality(): WithOrdinalityContext | null {
        return this.getRuleContext(0, WithOrdinalityContext);
    }
    public tableProjection(): TableProjectionContext | null {
        return this.getRuleContext(0, TableProjectionContext);
    }
}
export class WrappedTableReferenceContext extends TableReferenceContext {
    public constructor(ctx: TableReferenceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public tableReference(): TableReferenceContext {
        return this.getRuleContext(0, TableReferenceContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class BaseTableContext extends TableReferenceContext {
    public constructor(ctx: TableReferenceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public fromTableRef(): FromTableRefContext {
        return this.getRuleContext(0, FromTableRefContext)!;
    }
    public querySystemTimePeriodSpecification(): QuerySystemTimePeriodSpecificationContext[];
    public querySystemTimePeriodSpecification(i: number): QuerySystemTimePeriodSpecificationContext | null;
    public querySystemTimePeriodSpecification(i?: number): QuerySystemTimePeriodSpecificationContext[] | QuerySystemTimePeriodSpecificationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(QuerySystemTimePeriodSpecificationContext);
        }

        return this.getRuleContext(i, QuerySystemTimePeriodSpecificationContext);
    }
    public queryValidTimePeriodSpecification(): QueryValidTimePeriodSpecificationContext[];
    public queryValidTimePeriodSpecification(i: number): QueryValidTimePeriodSpecificationContext | null;
    public queryValidTimePeriodSpecification(i?: number): QueryValidTimePeriodSpecificationContext[] | QueryValidTimePeriodSpecificationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(QueryValidTimePeriodSpecificationContext);
        }

        return this.getRuleContext(i, QueryValidTimePeriodSpecificationContext);
    }
    public tableAlias(): TableAliasContext | null {
        return this.getRuleContext(0, TableAliasContext);
    }
    public tableProjection(): TableProjectionContext | null {
        return this.getRuleContext(0, TableProjectionContext);
    }
}
export class CrossJoinTableContext extends TableReferenceContext {
    public constructor(ctx: TableReferenceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public tableReference(): TableReferenceContext[];
    public tableReference(i: number): TableReferenceContext | null;
    public tableReference(i?: number): TableReferenceContext[] | TableReferenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TableReferenceContext);
        }

        return this.getRuleContext(i, TableReferenceContext);
    }
    public CROSS(): antlr.TerminalNode {
        return this.getToken(Sql.CROSS, 0)!;
    }
    public JOIN(): antlr.TerminalNode {
        return this.getToken(Sql.JOIN, 0)!;
    }
}
export class CollectionDerivedTableContext extends TableReferenceContext {
    public constructor(ctx: TableReferenceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public UNNEST(): antlr.TerminalNode {
        return this.getToken(Sql.UNNEST, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public tableAlias(): TableAliasContext {
        return this.getRuleContext(0, TableAliasContext)!;
    }
    public withOrdinality(): WithOrdinalityContext | null {
        return this.getRuleContext(0, WithOrdinalityContext);
    }
    public tableProjection(): TableProjectionContext | null {
        return this.getRuleContext(0, TableProjectionContext);
    }
}
export class ExprDerivedTableContext extends TableReferenceContext {
    public constructor(ctx: TableReferenceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public withOrdinality(): WithOrdinalityContext | null {
        return this.getRuleContext(0, WithOrdinalityContext);
    }
    public tableAlias(): TableAliasContext | null {
        return this.getRuleContext(0, TableAliasContext);
    }
    public tableProjection(): TableProjectionContext | null {
        return this.getRuleContext(0, TableProjectionContext);
    }
}
export class NaturalJoinTableContext extends TableReferenceContext {
    public constructor(ctx: TableReferenceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public tableReference(): TableReferenceContext[];
    public tableReference(i: number): TableReferenceContext | null;
    public tableReference(i?: number): TableReferenceContext[] | TableReferenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TableReferenceContext);
        }

        return this.getRuleContext(i, TableReferenceContext);
    }
    public NATURAL(): antlr.TerminalNode {
        return this.getToken(Sql.NATURAL, 0)!;
    }
    public JOIN(): antlr.TerminalNode {
        return this.getToken(Sql.JOIN, 0)!;
    }
    public joinType(): JoinTypeContext | null {
        return this.getRuleContext(0, JoinTypeContext);
    }
}
export class JoinTableContext extends TableReferenceContext {
    public constructor(ctx: TableReferenceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public tableReference(): TableReferenceContext[];
    public tableReference(i: number): TableReferenceContext | null;
    public tableReference(i?: number): TableReferenceContext[] | TableReferenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TableReferenceContext);
        }

        return this.getRuleContext(i, TableReferenceContext);
    }
    public JOIN(): antlr.TerminalNode {
        return this.getToken(Sql.JOIN, 0)!;
    }
    public joinSpecification(): JoinSpecificationContext {
        return this.getRuleContext(0, JoinSpecificationContext)!;
    }
    public joinType(): JoinTypeContext | null {
        return this.getRuleContext(0, JoinTypeContext);
    }
}


export class WithOrdinalityContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WITH(): antlr.TerminalNode {
        return this.getToken(Sql.WITH, 0)!;
    }
    public ORDINALITY(): antlr.TerminalNode {
        return this.getToken(Sql.ORDINALITY, 0)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_withOrdinality;
    }
}


export class TableAliasContext extends antlr.ParserRuleContext {
    public _correlationName?: IdentifierContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public AS(): antlr.TerminalNode | null {
        return this.getToken(Sql.AS, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_tableAlias;
    }
}


export class TableProjectionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public columnNameList(): ColumnNameListContext {
        return this.getRuleContext(0, ColumnNameListContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_tableProjection;
    }
}


export class QuerySystemTimePeriodSpecificationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FOR(): antlr.TerminalNode {
        return this.getToken(Sql.FOR, 0)!;
    }
    public SYSTEM_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.SYSTEM_TIME, 0)!;
    }
    public tableTimePeriodSpecification(): TableTimePeriodSpecificationContext | null {
        return this.getRuleContext(0, TableTimePeriodSpecificationContext);
    }
    public ALL(): antlr.TerminalNode | null {
        return this.getToken(Sql.ALL, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_querySystemTimePeriodSpecification;
    }
}


export class QueryValidTimePeriodSpecificationContext extends antlr.ParserRuleContext {
    public _from_?: ExprContext;
    public _to?: ExprContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FOR(): antlr.TerminalNode {
        return this.getToken(Sql.FOR, 0)!;
    }
    public VALID_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.VALID_TIME, 0)!;
    }
    public tableTimePeriodSpecification(): TableTimePeriodSpecificationContext | null {
        return this.getRuleContext(0, TableTimePeriodSpecificationContext);
    }
    public ONLY(): antlr.TerminalNode | null {
        return this.getToken(Sql.ONLY, 0);
    }
    public FROM(): antlr.TerminalNode | null {
        return this.getToken(Sql.FROM, 0);
    }
    public TO(): antlr.TerminalNode | null {
        return this.getToken(Sql.TO, 0);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public ALL(): antlr.TerminalNode | null {
        return this.getToken(Sql.ALL, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_queryValidTimePeriodSpecification;
    }
}


export class TableTimePeriodSpecificationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_tableTimePeriodSpecification;
    }
    public override copyFrom(ctx: TableTimePeriodSpecificationContext): void {
        super.copyFrom(ctx);
    }
}
export class TableFromToContext extends TableTimePeriodSpecificationContext {
    public _from_?: ExprContext;
    public _to?: ExprContext;
    public constructor(ctx: TableTimePeriodSpecificationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public TO(): antlr.TerminalNode {
        return this.getToken(Sql.TO, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
}
export class TableAsOfContext extends TableTimePeriodSpecificationContext {
    public _at?: ExprContext;
    public constructor(ctx: TableTimePeriodSpecificationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public AS(): antlr.TerminalNode {
        return this.getToken(Sql.AS, 0)!;
    }
    public OF(): antlr.TerminalNode {
        return this.getToken(Sql.OF, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class TableBetweenContext extends TableTimePeriodSpecificationContext {
    public _from_?: ExprContext;
    public _to?: ExprContext;
    public constructor(ctx: TableTimePeriodSpecificationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public BETWEEN(): antlr.TerminalNode {
        return this.getToken(Sql.BETWEEN, 0)!;
    }
    public AND(): antlr.TerminalNode {
        return this.getToken(Sql.AND, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
}
export class TableAllTimeContext extends TableTimePeriodSpecificationContext {
    public constructor(ctx: TableTimePeriodSpecificationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ALL(): antlr.TerminalNode {
        return this.getToken(Sql.ALL, 0)!;
    }
}


export class FromTableRefContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
    }
    public DOT(): antlr.TerminalNode[];
    public DOT(i: number): antlr.TerminalNode | null;
    public DOT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.DOT);
    	} else {
    		return this.getToken(Sql.DOT, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_fromTableRef;
    }
}


export class ColumnNameListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public columnName(): ColumnNameContext[];
    public columnName(i: number): ColumnNameContext | null;
    public columnName(i?: number): ColumnNameContext[] | ColumnNameContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ColumnNameContext);
        }

        return this.getRuleContext(i, ColumnNameContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_columnNameList;
    }
}


export class JoinSpecificationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_joinSpecification;
    }
    public override copyFrom(ctx: JoinSpecificationContext): void {
        super.copyFrom(ctx);
    }
}
export class NamedColumnsJoinContext extends JoinSpecificationContext {
    public constructor(ctx: JoinSpecificationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public USING(): antlr.TerminalNode {
        return this.getToken(Sql.USING, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public columnNameList(): ColumnNameListContext {
        return this.getRuleContext(0, ColumnNameListContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class JoinConditionContext extends JoinSpecificationContext {
    public constructor(ctx: JoinSpecificationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ON(): antlr.TerminalNode {
        return this.getToken(Sql.ON, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}


export class JoinTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INNER(): antlr.TerminalNode | null {
        return this.getToken(Sql.INNER, 0);
    }
    public outerJoinType(): OuterJoinTypeContext | null {
        return this.getRuleContext(0, OuterJoinTypeContext);
    }
    public OUTER(): antlr.TerminalNode | null {
        return this.getToken(Sql.OUTER, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_joinType;
    }
}


export class OuterJoinTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LEFT(): antlr.TerminalNode | null {
        return this.getToken(Sql.LEFT, 0);
    }
    public RIGHT(): antlr.TerminalNode | null {
        return this.getToken(Sql.RIGHT, 0);
    }
    public FULL(): antlr.TerminalNode | null {
        return this.getToken(Sql.FULL, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_outerJoinType;
    }
}


export class WhereClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WHERE(): antlr.TerminalNode {
        return this.getToken(Sql.WHERE, 0)!;
    }
    public searchCondition(): SearchConditionContext {
        return this.getRuleContext(0, SearchConditionContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_whereClause;
    }
}


export class GroupByClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public GROUP(): antlr.TerminalNode {
        return this.getToken(Sql.GROUP, 0)!;
    }
    public BY(): antlr.TerminalNode {
        return this.getToken(Sql.BY, 0)!;
    }
    public groupingElement(): GroupingElementContext[];
    public groupingElement(i: number): GroupingElementContext | null;
    public groupingElement(i?: number): GroupingElementContext[] | GroupingElementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(GroupingElementContext);
        }

        return this.getRuleContext(i, GroupingElementContext);
    }
    public setQuantifier(): SetQuantifierContext | null {
        return this.getRuleContext(0, SetQuantifierContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_groupByClause;
    }
}


export class GroupingElementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_groupingElement;
    }
    public override copyFrom(ctx: GroupingElementContext): void {
        super.copyFrom(ctx);
    }
}
export class EmptyGroupingSetContext extends GroupingElementContext {
    public constructor(ctx: GroupingElementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class ExpressionGroupingSetContext extends GroupingElementContext {
    public constructor(ctx: GroupingElementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}


export class HavingClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public HAVING(): antlr.TerminalNode {
        return this.getToken(Sql.HAVING, 0)!;
    }
    public searchCondition(): SearchConditionContext {
        return this.getRuleContext(0, SearchConditionContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_havingClause;
    }
}


export class WindowClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WINDOW(): antlr.TerminalNode {
        return this.getToken(Sql.WINDOW, 0)!;
    }
    public windowDefinitionList(): WindowDefinitionListContext {
        return this.getRuleContext(0, WindowDefinitionListContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowClause;
    }
}


export class WindowDefinitionListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public windowDefinition(): WindowDefinitionContext[];
    public windowDefinition(i: number): WindowDefinitionContext | null;
    public windowDefinition(i?: number): WindowDefinitionContext[] | WindowDefinitionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(WindowDefinitionContext);
        }

        return this.getRuleContext(i, WindowDefinitionContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowDefinitionList;
    }
}


export class WindowDefinitionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public newWindowName(): NewWindowNameContext {
        return this.getRuleContext(0, NewWindowNameContext)!;
    }
    public AS(): antlr.TerminalNode {
        return this.getToken(Sql.AS, 0)!;
    }
    public windowSpecification(): WindowSpecificationContext {
        return this.getRuleContext(0, WindowSpecificationContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowDefinition;
    }
}


export class NewWindowNameContext extends antlr.ParserRuleContext {
    public _windowName?: IdentifierContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_newWindowName;
    }
}


export class WindowSpecificationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public windowSpecificationDetails(): WindowSpecificationDetailsContext {
        return this.getRuleContext(0, WindowSpecificationDetailsContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowSpecification;
    }
}


export class WindowSpecificationDetailsContext extends antlr.ParserRuleContext {
    public _existingWindowName?: IdentifierContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public windowPartitionClause(): WindowPartitionClauseContext | null {
        return this.getRuleContext(0, WindowPartitionClauseContext);
    }
    public windowOrderClause(): WindowOrderClauseContext | null {
        return this.getRuleContext(0, WindowOrderClauseContext);
    }
    public windowFrameClause(): WindowFrameClauseContext | null {
        return this.getRuleContext(0, WindowFrameClauseContext);
    }
    public identifier(): IdentifierContext | null {
        return this.getRuleContext(0, IdentifierContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowSpecificationDetails;
    }
}


export class WindowPartitionClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public PARTITION(): antlr.TerminalNode {
        return this.getToken(Sql.PARTITION, 0)!;
    }
    public BY(): antlr.TerminalNode {
        return this.getToken(Sql.BY, 0)!;
    }
    public windowPartitionColumnReferenceList(): WindowPartitionColumnReferenceListContext {
        return this.getRuleContext(0, WindowPartitionColumnReferenceListContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowPartitionClause;
    }
}


export class WindowPartitionColumnReferenceListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public columnReference(): ColumnReferenceContext[];
    public columnReference(i: number): ColumnReferenceContext | null;
    public columnReference(i?: number): ColumnReferenceContext[] | ColumnReferenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ColumnReferenceContext);
        }

        return this.getRuleContext(i, ColumnReferenceContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowPartitionColumnReferenceList;
    }
}


export class WindowOrderClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ORDER(): antlr.TerminalNode {
        return this.getToken(Sql.ORDER, 0)!;
    }
    public BY(): antlr.TerminalNode {
        return this.getToken(Sql.BY, 0)!;
    }
    public sortSpecificationList(): SortSpecificationListContext {
        return this.getRuleContext(0, SortSpecificationListContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowOrderClause;
    }
}


export class WindowFrameClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public windowFrameUnits(): WindowFrameUnitsContext {
        return this.getRuleContext(0, WindowFrameUnitsContext)!;
    }
    public windowFrameExtent(): WindowFrameExtentContext {
        return this.getRuleContext(0, WindowFrameExtentContext)!;
    }
    public windowFrameExclusion(): WindowFrameExclusionContext | null {
        return this.getRuleContext(0, WindowFrameExclusionContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowFrameClause;
    }
}


export class WindowFrameUnitsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ROWS(): antlr.TerminalNode | null {
        return this.getToken(Sql.ROWS, 0);
    }
    public RANGE(): antlr.TerminalNode | null {
        return this.getToken(Sql.RANGE, 0);
    }
    public GROUPS(): antlr.TerminalNode | null {
        return this.getToken(Sql.GROUPS, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowFrameUnits;
    }
}


export class WindowFrameExtentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public windowFrameStart(): WindowFrameStartContext | null {
        return this.getRuleContext(0, WindowFrameStartContext);
    }
    public windowFrameBetween(): WindowFrameBetweenContext | null {
        return this.getRuleContext(0, WindowFrameBetweenContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowFrameExtent;
    }
}


export class WindowFrameStartContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNBOUNDED(): antlr.TerminalNode | null {
        return this.getToken(Sql.UNBOUNDED, 0);
    }
    public PRECEDING(): antlr.TerminalNode | null {
        return this.getToken(Sql.PRECEDING, 0);
    }
    public windowFramePreceding(): WindowFramePrecedingContext | null {
        return this.getRuleContext(0, WindowFramePrecedingContext);
    }
    public CURRENT(): antlr.TerminalNode | null {
        return this.getToken(Sql.CURRENT, 0);
    }
    public ROW(): antlr.TerminalNode | null {
        return this.getToken(Sql.ROW, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowFrameStart;
    }
}


export class WindowFramePrecedingContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNSIGNED_INTEGER(): antlr.TerminalNode {
        return this.getToken(Sql.UNSIGNED_INTEGER, 0)!;
    }
    public PRECEDING(): antlr.TerminalNode {
        return this.getToken(Sql.PRECEDING, 0)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowFramePreceding;
    }
}


export class WindowFrameBetweenContext extends antlr.ParserRuleContext {
    public _windowFrameBound1?: WindowFrameBoundContext;
    public _windowFrameBound2?: WindowFrameBoundContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public BETWEEN(): antlr.TerminalNode {
        return this.getToken(Sql.BETWEEN, 0)!;
    }
    public AND(): antlr.TerminalNode {
        return this.getToken(Sql.AND, 0)!;
    }
    public windowFrameBound(): WindowFrameBoundContext[];
    public windowFrameBound(i: number): WindowFrameBoundContext | null;
    public windowFrameBound(i?: number): WindowFrameBoundContext[] | WindowFrameBoundContext | null {
        if (i === undefined) {
            return this.getRuleContexts(WindowFrameBoundContext);
        }

        return this.getRuleContext(i, WindowFrameBoundContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowFrameBetween;
    }
}


export class WindowFrameBoundContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public windowFrameStart(): WindowFrameStartContext | null {
        return this.getRuleContext(0, WindowFrameStartContext);
    }
    public UNBOUNDED(): antlr.TerminalNode | null {
        return this.getToken(Sql.UNBOUNDED, 0);
    }
    public FOLLOWING(): antlr.TerminalNode | null {
        return this.getToken(Sql.FOLLOWING, 0);
    }
    public windowFrameFollowing(): WindowFrameFollowingContext | null {
        return this.getRuleContext(0, WindowFrameFollowingContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowFrameBound;
    }
}


export class WindowFrameFollowingContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNSIGNED_INTEGER(): antlr.TerminalNode {
        return this.getToken(Sql.UNSIGNED_INTEGER, 0)!;
    }
    public FOLLOWING(): antlr.TerminalNode {
        return this.getToken(Sql.FOLLOWING, 0)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowFrameFollowing;
    }
}


export class WindowFrameExclusionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EXCLUDE(): antlr.TerminalNode {
        return this.getToken(Sql.EXCLUDE, 0)!;
    }
    public CURRENT(): antlr.TerminalNode | null {
        return this.getToken(Sql.CURRENT, 0);
    }
    public ROW(): antlr.TerminalNode | null {
        return this.getToken(Sql.ROW, 0);
    }
    public GROUP(): antlr.TerminalNode | null {
        return this.getToken(Sql.GROUP, 0);
    }
    public TIES(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIES, 0);
    }
    public NO(): antlr.TerminalNode | null {
        return this.getToken(Sql.NO, 0);
    }
    public OTHERS(): antlr.TerminalNode | null {
        return this.getToken(Sql.OTHERS, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_windowFrameExclusion;
    }
}


export class SelectClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public SELECT(): antlr.TerminalNode {
        return this.getToken(Sql.SELECT, 0)!;
    }
    public selectList(): SelectListContext {
        return this.getRuleContext(0, SelectListContext)!;
    }
    public setQuantifier(): SetQuantifierContext | null {
        return this.getRuleContext(0, SetQuantifierContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_selectClause;
    }
}


export class SelectListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public selectListAsterisk(): SelectListAsteriskContext | null {
        return this.getRuleContext(0, SelectListAsteriskContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public selectSublist(): SelectSublistContext[];
    public selectSublist(i: number): SelectSublistContext | null;
    public selectSublist(i?: number): SelectSublistContext[] | SelectSublistContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SelectSublistContext);
        }

        return this.getRuleContext(i, SelectSublistContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_selectList;
    }
}


export class SelectListAsteriskContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ASTERISK(): antlr.TerminalNode {
        return this.getToken(Sql.ASTERISK, 0)!;
    }
    public excludeClause(): ExcludeClauseContext | null {
        return this.getRuleContext(0, ExcludeClauseContext);
    }
    public renameClause(): RenameClauseContext | null {
        return this.getRuleContext(0, RenameClauseContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_selectListAsterisk;
    }
}


export class SelectSublistContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public derivedColumn(): DerivedColumnContext | null {
        return this.getRuleContext(0, DerivedColumnContext);
    }
    public qualifiedAsterisk(): QualifiedAsteriskContext | null {
        return this.getRuleContext(0, QualifiedAsteriskContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_selectSublist;
    }
}


export class QualifiedAsteriskContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifierChain(): IdentifierChainContext {
        return this.getRuleContext(0, IdentifierChainContext)!;
    }
    public DOT(): antlr.TerminalNode {
        return this.getToken(Sql.DOT, 0)!;
    }
    public ASTERISK(): antlr.TerminalNode {
        return this.getToken(Sql.ASTERISK, 0)!;
    }
    public excludeClause(): ExcludeClauseContext | null {
        return this.getRuleContext(0, ExcludeClauseContext);
    }
    public qualifiedRenameClause(): QualifiedRenameClauseContext | null {
        return this.getRuleContext(0, QualifiedRenameClauseContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_qualifiedAsterisk;
    }
}


export class RenameClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public RENAME(): antlr.TerminalNode {
        return this.getToken(Sql.RENAME, 0)!;
    }
    public renameColumn(): RenameColumnContext[];
    public renameColumn(i: number): RenameColumnContext | null;
    public renameColumn(i?: number): RenameColumnContext[] | RenameColumnContext | null {
        if (i === undefined) {
            return this.getRuleContexts(RenameColumnContext);
        }

        return this.getRuleContext(i, RenameColumnContext);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_renameClause;
    }
}


export class RenameColumnContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public columnReference(): ColumnReferenceContext {
        return this.getRuleContext(0, ColumnReferenceContext)!;
    }
    public asClause(): AsClauseContext {
        return this.getRuleContext(0, AsClauseContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_renameColumn;
    }
}


export class QualifiedRenameClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public RENAME(): antlr.TerminalNode {
        return this.getToken(Sql.RENAME, 0)!;
    }
    public qualifiedRenameColumn(): QualifiedRenameColumnContext[];
    public qualifiedRenameColumn(i: number): QualifiedRenameColumnContext | null;
    public qualifiedRenameColumn(i?: number): QualifiedRenameColumnContext[] | QualifiedRenameColumnContext | null {
        if (i === undefined) {
            return this.getRuleContexts(QualifiedRenameColumnContext);
        }

        return this.getRuleContext(i, QualifiedRenameColumnContext);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_qualifiedRenameClause;
    }
}


export class QualifiedRenameColumnContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public asClause(): AsClauseContext {
        return this.getRuleContext(0, AsClauseContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_qualifiedRenameColumn;
    }
}


export class ExcludeClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EXCLUDE(): antlr.TerminalNode {
        return this.getToken(Sql.EXCLUDE, 0)!;
    }
    public identifier(): IdentifierContext[];
    public identifier(i: number): IdentifierContext | null;
    public identifier(i?: number): IdentifierContext[] | IdentifierContext | null {
        if (i === undefined) {
            return this.getRuleContexts(IdentifierContext);
        }

        return this.getRuleContext(i, IdentifierContext);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_excludeClause;
    }
}


export class DerivedColumnContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public asClause(): AsClauseContext | null {
        return this.getRuleContext(0, AsClauseContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_derivedColumn;
    }
}


export class AsClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public AS(): antlr.TerminalNode | null {
        return this.getToken(Sql.AS, 0);
    }
    public columnLabel(): ColumnLabelContext | null {
        return this.getRuleContext(0, ColumnLabelContext);
    }
    public DEFAULT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DEFAULT, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_asClause;
    }
}


export class QueryExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public queryExpressionNoWith(): QueryExpressionNoWithContext {
        return this.getRuleContext(0, QueryExpressionNoWithContext)!;
    }
    public withClause(): WithClauseContext | null {
        return this.getRuleContext(0, WithClauseContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_queryExpression;
    }
}


export class QueryExpressionNoWithContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public queryExpressionBody(): QueryExpressionBodyContext {
        return this.getRuleContext(0, QueryExpressionBodyContext)!;
    }
    public orderByClause(): OrderByClauseContext | null {
        return this.getRuleContext(0, OrderByClauseContext);
    }
    public offsetAndLimit(): OffsetAndLimitContext | null {
        return this.getRuleContext(0, OffsetAndLimitContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_queryExpressionNoWith;
    }
}


export class WithClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WITH(): antlr.TerminalNode {
        return this.getToken(Sql.WITH, 0)!;
    }
    public withListElement(): WithListElementContext[];
    public withListElement(i: number): WithListElementContext | null;
    public withListElement(i?: number): WithListElementContext[] | WithListElementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(WithListElementContext);
        }

        return this.getRuleContext(i, WithListElementContext);
    }
    public RECURSIVE(): antlr.TerminalNode | null {
        return this.getToken(Sql.RECURSIVE, 0);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_withClause;
    }
}


export class WithListElementContext extends antlr.ParserRuleContext {
    public _queryName?: IdentifierContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public AS(): antlr.TerminalNode {
        return this.getToken(Sql.AS, 0)!;
    }
    public subquery(): SubqueryContext {
        return this.getRuleContext(0, SubqueryContext)!;
    }
    public identifier(): IdentifierContext {
        return this.getRuleContext(0, IdentifierContext)!;
    }
    public MATERIALIZED(): antlr.TerminalNode | null {
        return this.getToken(Sql.MATERIALIZED, 0);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public columnNameList(): ColumnNameListContext | null {
        return this.getRuleContext(0, ColumnNameListContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_withListElement;
    }
}


export class QueryExpressionBodyContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_queryExpressionBody;
    }
    public override copyFrom(ctx: QueryExpressionBodyContext): void {
        super.copyFrom(ctx);
    }
}
export class QuerySpecificationContext extends QueryExpressionBodyContext {
    public constructor(ctx: QueryExpressionBodyContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public selectClause(): SelectClauseContext | null {
        return this.getRuleContext(0, SelectClauseContext);
    }
    public fromClause(): FromClauseContext | null {
        return this.getRuleContext(0, FromClauseContext);
    }
    public whereClause(): WhereClauseContext | null {
        return this.getRuleContext(0, WhereClauseContext);
    }
    public groupByClause(): GroupByClauseContext | null {
        return this.getRuleContext(0, GroupByClauseContext);
    }
    public havingClause(): HavingClauseContext | null {
        return this.getRuleContext(0, HavingClauseContext);
    }
    public windowClause(): WindowClauseContext | null {
        return this.getRuleContext(0, WindowClauseContext);
    }
    public queryTail(): QueryTailContext[];
    public queryTail(i: number): QueryTailContext | null;
    public queryTail(i?: number): QueryTailContext[] | QueryTailContext | null {
        if (i === undefined) {
            return this.getRuleContexts(QueryTailContext);
        }

        return this.getRuleContext(i, QueryTailContext);
    }
}
export class RecordsQueryContext extends QueryExpressionBodyContext {
    public constructor(ctx: QueryExpressionBodyContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public recordsValueConstructor(): RecordsValueConstructorContext {
        return this.getRuleContext(0, RecordsValueConstructorContext)!;
    }
}
export class WrappedQueryContext extends QueryExpressionBodyContext {
    public constructor(ctx: QueryExpressionBodyContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public queryExpressionNoWith(): QueryExpressionNoWithContext {
        return this.getRuleContext(0, QueryExpressionNoWithContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}
export class XtqlQueryContext extends QueryExpressionBodyContext {
    public _xtqlQuery?: CharacterStringContext;
    public constructor(ctx: QueryExpressionBodyContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public XTQL(): antlr.TerminalNode {
        return this.getToken(Sql.XTQL, 0)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public xtqlParams(): XtqlParamsContext | null {
        return this.getRuleContext(0, XtqlParamsContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
    public characterString(): CharacterStringContext | null {
        return this.getRuleContext(0, CharacterStringContext);
    }
}
export class ValuesQueryContext extends QueryExpressionBodyContext {
    public constructor(ctx: QueryExpressionBodyContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public tableValueConstructor(): TableValueConstructorContext {
        return this.getRuleContext(0, TableValueConstructorContext)!;
    }
}
export class IntersectQueryContext extends QueryExpressionBodyContext {
    public _left?: QueryExpressionBodyContext;
    public _right?: QueryExpressionBodyContext;
    public constructor(ctx: QueryExpressionBodyContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public INTERSECT(): antlr.TerminalNode {
        return this.getToken(Sql.INTERSECT, 0)!;
    }
    public queryExpressionBody(): QueryExpressionBodyContext[];
    public queryExpressionBody(i: number): QueryExpressionBodyContext | null;
    public queryExpressionBody(i?: number): QueryExpressionBodyContext[] | QueryExpressionBodyContext | null {
        if (i === undefined) {
            return this.getRuleContexts(QueryExpressionBodyContext);
        }

        return this.getRuleContext(i, QueryExpressionBodyContext);
    }
    public ALL(): antlr.TerminalNode | null {
        return this.getToken(Sql.ALL, 0);
    }
    public DISTINCT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DISTINCT, 0);
    }
}
export class UnionOrExceptQueryContext extends QueryExpressionBodyContext {
    public _left?: QueryExpressionBodyContext;
    public _right?: QueryExpressionBodyContext;
    public constructor(ctx: QueryExpressionBodyContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public queryExpressionBody(): QueryExpressionBodyContext[];
    public queryExpressionBody(i: number): QueryExpressionBodyContext | null;
    public queryExpressionBody(i?: number): QueryExpressionBodyContext[] | QueryExpressionBodyContext | null {
        if (i === undefined) {
            return this.getRuleContexts(QueryExpressionBodyContext);
        }

        return this.getRuleContext(i, QueryExpressionBodyContext);
    }
    public UNION(): antlr.TerminalNode | null {
        return this.getToken(Sql.UNION, 0);
    }
    public EXCEPT(): antlr.TerminalNode | null {
        return this.getToken(Sql.EXCEPT, 0);
    }
    public ALL(): antlr.TerminalNode | null {
        return this.getToken(Sql.ALL, 0);
    }
    public DISTINCT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DISTINCT, 0);
    }
}


export class XtqlParamsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public parameterSpecification(): ParameterSpecificationContext[];
    public parameterSpecification(i: number): ParameterSpecificationContext | null;
    public parameterSpecification(i?: number): ParameterSpecificationContext[] | ParameterSpecificationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ParameterSpecificationContext);
        }

        return this.getRuleContext(i, ParameterSpecificationContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_xtqlParams;
    }
}


export class QueryTailContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_queryTail;
    }
    public override copyFrom(ctx: QueryTailContext): void {
        super.copyFrom(ctx);
    }
}
export class SelectTailContext extends QueryTailContext {
    public constructor(ctx: QueryTailContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public selectClause(): SelectClauseContext {
        return this.getRuleContext(0, SelectClauseContext)!;
    }
    public groupByClause(): GroupByClauseContext | null {
        return this.getRuleContext(0, GroupByClauseContext);
    }
    public havingClause(): HavingClauseContext | null {
        return this.getRuleContext(0, HavingClauseContext);
    }
}
export class WhereTailContext extends QueryTailContext {
    public constructor(ctx: QueryTailContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public whereClause(): WhereClauseContext {
        return this.getRuleContext(0, WhereClauseContext)!;
    }
}


export class OrderByClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ORDER(): antlr.TerminalNode {
        return this.getToken(Sql.ORDER, 0)!;
    }
    public BY(): antlr.TerminalNode {
        return this.getToken(Sql.BY, 0)!;
    }
    public sortSpecificationList(): SortSpecificationListContext {
        return this.getRuleContext(0, SortSpecificationListContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_orderByClause;
    }
}


export class OffsetAndLimitContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public resultOffsetClause(): ResultOffsetClauseContext | null {
        return this.getRuleContext(0, ResultOffsetClauseContext);
    }
    public fetchFirstClause(): FetchFirstClauseContext | null {
        return this.getRuleContext(0, FetchFirstClauseContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_offsetAndLimit;
    }
}


export class ResultOffsetClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public OFFSET(): antlr.TerminalNode {
        return this.getToken(Sql.OFFSET, 0)!;
    }
    public offsetRowCount(): OffsetRowCountContext {
        return this.getRuleContext(0, OffsetRowCountContext)!;
    }
    public ROW(): antlr.TerminalNode | null {
        return this.getToken(Sql.ROW, 0);
    }
    public ROWS(): antlr.TerminalNode | null {
        return this.getToken(Sql.ROWS, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_resultOffsetClause;
    }
}


export class FetchFirstClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FETCH(): antlr.TerminalNode | null {
        return this.getToken(Sql.FETCH, 0);
    }
    public ONLY(): antlr.TerminalNode | null {
        return this.getToken(Sql.ONLY, 0);
    }
    public FIRST(): antlr.TerminalNode | null {
        return this.getToken(Sql.FIRST, 0);
    }
    public NEXT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NEXT, 0);
    }
    public ROW(): antlr.TerminalNode | null {
        return this.getToken(Sql.ROW, 0);
    }
    public ROWS(): antlr.TerminalNode | null {
        return this.getToken(Sql.ROWS, 0);
    }
    public fetchFirstRowCount(): FetchFirstRowCountContext | null {
        return this.getRuleContext(0, FetchFirstRowCountContext);
    }
    public LIMIT(): antlr.TerminalNode | null {
        return this.getToken(Sql.LIMIT, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_fetchFirstClause;
    }
}


export class OffsetRowCountContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNSIGNED_INTEGER(): antlr.TerminalNode | null {
        return this.getToken(Sql.UNSIGNED_INTEGER, 0);
    }
    public parameterSpecification(): ParameterSpecificationContext | null {
        return this.getRuleContext(0, ParameterSpecificationContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_offsetRowCount;
    }
}


export class FetchFirstRowCountContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNSIGNED_INTEGER(): antlr.TerminalNode | null {
        return this.getToken(Sql.UNSIGNED_INTEGER, 0);
    }
    public parameterSpecification(): ParameterSpecificationContext | null {
        return this.getRuleContext(0, ParameterSpecificationContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_fetchFirstRowCount;
    }
}


export class SubqueryContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public queryExpression(): QueryExpressionContext {
        return this.getRuleContext(0, QueryExpressionContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_subquery;
    }
}


export class PredicatePart2Context extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_predicatePart2;
    }
    public override copyFrom(ctx: PredicatePart2Context): void {
        super.copyFrom(ctx);
    }
}
export class InPredicatePart2Context extends PredicatePart2Context {
    public constructor(ctx: PredicatePart2Context) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public IN(): antlr.TerminalNode {
        return this.getToken(Sql.IN, 0)!;
    }
    public inPredicateValue(): InPredicateValueContext {
        return this.getRuleContext(0, InPredicateValueContext)!;
    }
    public NOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT, 0);
    }
}
export class ComparisonPredicatePart2Context extends PredicatePart2Context {
    public constructor(ctx: PredicatePart2Context) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public compOp(): CompOpContext {
        return this.getRuleContext(0, CompOpContext)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class LikeRegexPredicatePart2Context extends PredicatePart2Context {
    public _xqueryPattern?: CommonValueExprContext;
    public _xqueryOptionFlag?: CommonValueExprContext;
    public constructor(ctx: PredicatePart2Context) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LIKE_REGEX(): antlr.TerminalNode {
        return this.getToken(Sql.LIKE_REGEX, 0)!;
    }
    public commonValueExpr(): CommonValueExprContext[];
    public commonValueExpr(i: number): CommonValueExprContext | null;
    public commonValueExpr(i?: number): CommonValueExprContext[] | CommonValueExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CommonValueExprContext);
        }

        return this.getRuleContext(i, CommonValueExprContext);
    }
    public NOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT, 0);
    }
    public FLAG(): antlr.TerminalNode | null {
        return this.getToken(Sql.FLAG, 0);
    }
}
export class NullPredicatePart2Context extends PredicatePart2Context {
    public constructor(ctx: PredicatePart2Context) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public IS(): antlr.TerminalNode {
        return this.getToken(Sql.IS, 0)!;
    }
    public NULL(): antlr.TerminalNode {
        return this.getToken(Sql.NULL, 0)!;
    }
    public NOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT, 0);
    }
}
export class QuantifiedComparisonPredicatePart2Context extends PredicatePart2Context {
    public constructor(ctx: PredicatePart2Context) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public compOp(): CompOpContext {
        return this.getRuleContext(0, CompOpContext)!;
    }
    public quantifier(): QuantifierContext {
        return this.getRuleContext(0, QuantifierContext)!;
    }
    public quantifiedComparisonPredicatePart3(): QuantifiedComparisonPredicatePart3Context {
        return this.getRuleContext(0, QuantifiedComparisonPredicatePart3Context)!;
    }
}
export class BetweenPredicatePart2Context extends PredicatePart2Context {
    public constructor(ctx: PredicatePart2Context) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public BETWEEN(): antlr.TerminalNode {
        return this.getToken(Sql.BETWEEN, 0)!;
    }
    public commonValueExpr(): CommonValueExprContext[];
    public commonValueExpr(i: number): CommonValueExprContext | null;
    public commonValueExpr(i?: number): CommonValueExprContext[] | CommonValueExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CommonValueExprContext);
        }

        return this.getRuleContext(i, CommonValueExprContext);
    }
    public AND(): antlr.TerminalNode {
        return this.getToken(Sql.AND, 0)!;
    }
    public NOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT, 0);
    }
    public ASYMMETRIC(): antlr.TerminalNode | null {
        return this.getToken(Sql.ASYMMETRIC, 0);
    }
    public SYMMETRIC(): antlr.TerminalNode | null {
        return this.getToken(Sql.SYMMETRIC, 0);
    }
}
export class PostgresRegexPredicatePart2Context extends PredicatePart2Context {
    public _xqueryPattern?: CommonValueExprContext;
    public constructor(ctx: PredicatePart2Context) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public postgresRegexOperator(): PostgresRegexOperatorContext {
        return this.getRuleContext(0, PostgresRegexOperatorContext)!;
    }
    public commonValueExpr(): CommonValueExprContext {
        return this.getRuleContext(0, CommonValueExprContext)!;
    }
}
export class DistinctFromPredicatePart2Context extends PredicatePart2Context {
    public constructor(ctx: PredicatePart2Context) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public IS(): antlr.TerminalNode {
        return this.getToken(Sql.IS, 0)!;
    }
    public DISTINCT(): antlr.TerminalNode {
        return this.getToken(Sql.DISTINCT, 0)!;
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public NOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT, 0);
    }
}
export class LikePredicatePart2Context extends PredicatePart2Context {
    public _likePattern?: CommonValueExprContext;
    public _likeEscape?: CommonValueExprContext;
    public constructor(ctx: PredicatePart2Context) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LIKE(): antlr.TerminalNode | null {
        return this.getToken(Sql.LIKE, 0);
    }
    public ILIKE(): antlr.TerminalNode | null {
        return this.getToken(Sql.ILIKE, 0);
    }
    public commonValueExpr(): CommonValueExprContext[];
    public commonValueExpr(i: number): CommonValueExprContext | null;
    public commonValueExpr(i?: number): CommonValueExprContext[] | CommonValueExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CommonValueExprContext);
        }

        return this.getRuleContext(i, CommonValueExprContext);
    }
    public NOT(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT, 0);
    }
    public ESCAPE(): antlr.TerminalNode | null {
        return this.getToken(Sql.ESCAPE, 0);
    }
}


export class QuantifiedComparisonPredicatePart3Context extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_quantifiedComparisonPredicatePart3;
    }
    public override copyFrom(ctx: QuantifiedComparisonPredicatePart3Context): void {
        super.copyFrom(ctx);
    }
}
export class QuantifiedComparisonExprContext extends QuantifiedComparisonPredicatePart3Context {
    public constructor(ctx: QuantifiedComparisonPredicatePart3Context) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
}
export class QuantifiedComparisonSubqueryContext extends QuantifiedComparisonPredicatePart3Context {
    public constructor(ctx: QuantifiedComparisonPredicatePart3Context) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public subquery(): SubqueryContext {
        return this.getRuleContext(0, SubqueryContext)!;
    }
}


export class CompOpContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
    public NOT_EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.NOT_EQUAL, 0);
    }
    public LT_GT(): antlr.TerminalNode | null {
        return this.getToken(Sql.LT_GT, 0);
    }
    public LT(): antlr.TerminalNode | null {
        return this.getToken(Sql.LT, 0);
    }
    public GT(): antlr.TerminalNode | null {
        return this.getToken(Sql.GT, 0);
    }
    public LE(): antlr.TerminalNode | null {
        return this.getToken(Sql.LE, 0);
    }
    public GE(): antlr.TerminalNode | null {
        return this.getToken(Sql.GE, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_compOp;
    }
}


export class InPredicateValueContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_inPredicateValue;
    }
    public override copyFrom(ctx: InPredicateValueContext): void {
        super.copyFrom(ctx);
    }
}
export class InSubqueryContext extends InPredicateValueContext {
    public constructor(ctx: InPredicateValueContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public subquery(): SubqueryContext {
        return this.getRuleContext(0, SubqueryContext)!;
    }
}
export class InRowValueListContext extends InPredicateValueContext {
    public constructor(ctx: InPredicateValueContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public rowValueList(): RowValueListContext {
        return this.getRuleContext(0, RowValueListContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
}


export class PostgresRegexOperatorContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public TILDE(): antlr.TerminalNode | null {
        return this.getToken(Sql.TILDE, 0);
    }
    public PG_REGEX_I(): antlr.TerminalNode | null {
        return this.getToken(Sql.PG_REGEX_I, 0);
    }
    public PG_NOT_REGEX(): antlr.TerminalNode | null {
        return this.getToken(Sql.PG_NOT_REGEX, 0);
    }
    public PG_NOT_REGEX_I(): antlr.TerminalNode | null {
        return this.getToken(Sql.PG_NOT_REGEX_I, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_postgresRegexOperator;
    }
}


export class QuantifierContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ALL(): antlr.TerminalNode | null {
        return this.getToken(Sql.ALL, 0);
    }
    public SOME(): antlr.TerminalNode | null {
        return this.getToken(Sql.SOME, 0);
    }
    public ANY(): antlr.TerminalNode | null {
        return this.getToken(Sql.ANY, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_quantifier;
    }
}


export class SearchConditionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_searchCondition;
    }
}


export class AggregateFunctionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_aggregateFunction;
    }
    public override copyFrom(ctx: AggregateFunctionContext): void {
        super.copyFrom(ctx);
    }
}
export class CountStarFunctionContext extends AggregateFunctionContext {
    public constructor(ctx: AggregateFunctionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public COUNT(): antlr.TerminalNode {
        return this.getToken(Sql.COUNT, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public ASTERISK(): antlr.TerminalNode {
        return this.getToken(Sql.ASTERISK, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public aggregateFilterClause(): AggregateFilterClauseContext | null {
        return this.getRuleContext(0, AggregateFilterClauseContext);
    }
}
export class SetFunctionContext extends AggregateFunctionContext {
    public constructor(ctx: AggregateFunctionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public setFunctionType(): SetFunctionTypeContext {
        return this.getRuleContext(0, SetFunctionTypeContext)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public setQuantifier(): SetQuantifierContext | null {
        return this.getRuleContext(0, SetQuantifierContext);
    }
    public aggregateFilterClause(): AggregateFilterClauseContext | null {
        return this.getRuleContext(0, AggregateFilterClauseContext);
    }
}
export class OrderedSetFunctionContext extends AggregateFunctionContext {
    public constructor(ctx: AggregateFunctionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public orderedSetFunctionType(): OrderedSetFunctionTypeContext {
        return this.getRuleContext(0, OrderedSetFunctionTypeContext)!;
    }
    public LPAREN(): antlr.TerminalNode[];
    public LPAREN(i: number): antlr.TerminalNode | null;
    public LPAREN(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.LPAREN);
    	} else {
    		return this.getToken(Sql.LPAREN, i);
    	}
    }
    public percentileFraction(): PercentileFractionContext {
        return this.getRuleContext(0, PercentileFractionContext)!;
    }
    public RPAREN(): antlr.TerminalNode[];
    public RPAREN(i: number): antlr.TerminalNode | null;
    public RPAREN(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.RPAREN);
    	} else {
    		return this.getToken(Sql.RPAREN, i);
    	}
    }
    public WITHIN(): antlr.TerminalNode {
        return this.getToken(Sql.WITHIN, 0)!;
    }
    public GROUP(): antlr.TerminalNode {
        return this.getToken(Sql.GROUP, 0)!;
    }
    public ORDER(): antlr.TerminalNode {
        return this.getToken(Sql.ORDER, 0)!;
    }
    public BY(): antlr.TerminalNode {
        return this.getToken(Sql.BY, 0)!;
    }
    public sortSpecification(): SortSpecificationContext {
        return this.getRuleContext(0, SortSpecificationContext)!;
    }
    public aggregateFilterClause(): AggregateFilterClauseContext | null {
        return this.getRuleContext(0, AggregateFilterClauseContext);
    }
}
export class ArrayAggFunctionContext extends AggregateFunctionContext {
    public constructor(ctx: AggregateFunctionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ARRAY_AGG(): antlr.TerminalNode {
        return this.getToken(Sql.ARRAY_AGG, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public ORDER(): antlr.TerminalNode | null {
        return this.getToken(Sql.ORDER, 0);
    }
    public BY(): antlr.TerminalNode | null {
        return this.getToken(Sql.BY, 0);
    }
    public sortSpecificationList(): SortSpecificationListContext | null {
        return this.getRuleContext(0, SortSpecificationListContext);
    }
    public aggregateFilterClause(): AggregateFilterClauseContext | null {
        return this.getRuleContext(0, AggregateFilterClauseContext);
    }
}


export class AggregateFilterClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FILTER(): antlr.TerminalNode {
        return this.getToken(Sql.FILTER, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public WHERE(): antlr.TerminalNode {
        return this.getToken(Sql.WHERE, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_aggregateFilterClause;
    }
}


export class PercentileFractionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_percentileFraction;
    }
    public override copyFrom(ctx: PercentileFractionContext): void {
        super.copyFrom(ctx);
    }
}
export class PercentileFractionLiteralContext extends PercentileFractionContext {
    public constructor(ctx: PercentileFractionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public literal(): LiteralContext {
        return this.getRuleContext(0, LiteralContext)!;
    }
}
export class PercentileFractionParamContext extends PercentileFractionContext {
    public constructor(ctx: PercentileFractionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public parameterSpecification(): ParameterSpecificationContext {
        return this.getRuleContext(0, ParameterSpecificationContext)!;
    }
}


export class OrderedSetFunctionTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public PERCENTILE_CONT(): antlr.TerminalNode | null {
        return this.getToken(Sql.PERCENTILE_CONT, 0);
    }
    public PERCENTILE_DISC(): antlr.TerminalNode | null {
        return this.getToken(Sql.PERCENTILE_DISC, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_orderedSetFunctionType;
    }
}


export class SetFunctionTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public AVG(): antlr.TerminalNode | null {
        return this.getToken(Sql.AVG, 0);
    }
    public MAX(): antlr.TerminalNode | null {
        return this.getToken(Sql.MAX, 0);
    }
    public MIN(): antlr.TerminalNode | null {
        return this.getToken(Sql.MIN, 0);
    }
    public SUM(): antlr.TerminalNode | null {
        return this.getToken(Sql.SUM, 0);
    }
    public COUNT(): antlr.TerminalNode | null {
        return this.getToken(Sql.COUNT, 0);
    }
    public EVERY(): antlr.TerminalNode | null {
        return this.getToken(Sql.EVERY, 0);
    }
    public BOOL_AND(): antlr.TerminalNode | null {
        return this.getToken(Sql.BOOL_AND, 0);
    }
    public BOOL_OR(): antlr.TerminalNode | null {
        return this.getToken(Sql.BOOL_OR, 0);
    }
    public STDDEV_POP(): antlr.TerminalNode | null {
        return this.getToken(Sql.STDDEV_POP, 0);
    }
    public STDDEV_SAMP(): antlr.TerminalNode | null {
        return this.getToken(Sql.STDDEV_SAMP, 0);
    }
    public VAR_SAMP(): antlr.TerminalNode | null {
        return this.getToken(Sql.VAR_SAMP, 0);
    }
    public VAR_POP(): antlr.TerminalNode | null {
        return this.getToken(Sql.VAR_POP, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_setFunctionType;
    }
}


export class SetQuantifierContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public DISTINCT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DISTINCT, 0);
    }
    public ALL(): antlr.TerminalNode | null {
        return this.getToken(Sql.ALL, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_setQuantifier;
    }
}


export class SortSpecificationListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public sortSpecification(): SortSpecificationContext[];
    public sortSpecification(i: number): SortSpecificationContext | null;
    public sortSpecification(i?: number): SortSpecificationContext[] | SortSpecificationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SortSpecificationContext);
        }

        return this.getRuleContext(i, SortSpecificationContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_sortSpecificationList;
    }
}


export class SortSpecificationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public orderingSpecification(): OrderingSpecificationContext | null {
        return this.getRuleContext(0, OrderingSpecificationContext);
    }
    public nullOrdering(): NullOrderingContext | null {
        return this.getRuleContext(0, NullOrderingContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_sortSpecification;
    }
}


export class OrderingSpecificationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ASC(): antlr.TerminalNode | null {
        return this.getToken(Sql.ASC, 0);
    }
    public DESC(): antlr.TerminalNode | null {
        return this.getToken(Sql.DESC, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_orderingSpecification;
    }
}


export class NullOrderingContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public NULLS(): antlr.TerminalNode {
        return this.getToken(Sql.NULLS, 0)!;
    }
    public FIRST(): antlr.TerminalNode | null {
        return this.getToken(Sql.FIRST, 0);
    }
    public LAST(): antlr.TerminalNode | null {
        return this.getToken(Sql.LAST, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_nullOrdering;
    }
}


export class ReturningStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_returningStatement;
    }
    public override copyFrom(ctx: ReturningStatementContext): void {
        super.copyFrom(ctx);
    }
}
export class DmlReturningStatementContext extends ReturningStatementContext {
    public constructor(ctx: ReturningStatementContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public RETURNING(): antlr.TerminalNode {
        return this.getToken(Sql.RETURNING, 0)!;
    }
    public selectList(): SelectListContext {
        return this.getRuleContext(0, SelectListContext)!;
    }
}


export class DmlStatementValidTimeExtentsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_dmlStatementValidTimeExtents;
    }
    public override copyFrom(ctx: DmlStatementValidTimeExtentsContext): void {
        super.copyFrom(ctx);
    }
}
export class DmlStatementValidTimeAllContext extends DmlStatementValidTimeExtentsContext {
    public constructor(ctx: DmlStatementValidTimeExtentsContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public FOR(): antlr.TerminalNode {
        return this.getToken(Sql.FOR, 0)!;
    }
    public ALL(): antlr.TerminalNode | null {
        return this.getToken(Sql.ALL, 0);
    }
    public VALID_TIME(): antlr.TerminalNode | null {
        return this.getToken(Sql.VALID_TIME, 0);
    }
}
export class DmlStatementValidTimePortionContext extends DmlStatementValidTimeExtentsContext {
    public _from_?: StaticExprContext;
    public _to?: StaticExprContext;
    public constructor(ctx: DmlStatementValidTimeExtentsContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public FOR(): antlr.TerminalNode {
        return this.getToken(Sql.FOR, 0)!;
    }
    public VALID_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.VALID_TIME, 0)!;
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public staticExpr(): StaticExprContext[];
    public staticExpr(i: number): StaticExprContext | null;
    public staticExpr(i?: number): StaticExprContext[] | StaticExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StaticExprContext);
        }

        return this.getRuleContext(i, StaticExprContext);
    }
    public PORTION(): antlr.TerminalNode | null {
        return this.getToken(Sql.PORTION, 0);
    }
    public OF(): antlr.TerminalNode | null {
        return this.getToken(Sql.OF, 0);
    }
    public TO(): antlr.TerminalNode | null {
        return this.getToken(Sql.TO, 0);
    }
}


export class PatchStatementValidTimeExtentsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_patchStatementValidTimeExtents;
    }
    public override copyFrom(ctx: PatchStatementValidTimeExtentsContext): void {
        super.copyFrom(ctx);
    }
}
export class PatchStatementValidTimePortionContext extends PatchStatementValidTimeExtentsContext {
    public _from_?: StaticExprContext;
    public _to?: StaticExprContext;
    public constructor(ctx: PatchStatementValidTimeExtentsContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public FOR(): antlr.TerminalNode {
        return this.getToken(Sql.FOR, 0)!;
    }
    public VALID_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.VALID_TIME, 0)!;
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(Sql.FROM, 0)!;
    }
    public staticExpr(): StaticExprContext[];
    public staticExpr(i: number): StaticExprContext | null;
    public staticExpr(i?: number): StaticExprContext[] | StaticExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StaticExprContext);
        }

        return this.getRuleContext(i, StaticExprContext);
    }
    public PORTION(): antlr.TerminalNode | null {
        return this.getToken(Sql.PORTION, 0);
    }
    public OF(): antlr.TerminalNode | null {
        return this.getToken(Sql.OF, 0);
    }
    public TO(): antlr.TerminalNode | null {
        return this.getToken(Sql.TO, 0);
    }
}


export class PatchSourceContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_patchSource;
    }
    public override copyFrom(ctx: PatchSourceContext): void {
        super.copyFrom(ctx);
    }
}
export class PatchRecordsContext extends PatchSourceContext {
    public constructor(ctx: PatchSourceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public recordsValueConstructor(): RecordsValueConstructorContext {
        return this.getRuleContext(0, RecordsValueConstructorContext)!;
    }
}


export class InsertColumnsAndSourceContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_insertColumnsAndSource;
    }
    public override copyFrom(ctx: InsertColumnsAndSourceContext): void {
        super.copyFrom(ctx);
    }
}
export class InsertRecordsContext extends InsertColumnsAndSourceContext {
    public constructor(ctx: InsertColumnsAndSourceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public recordsValueConstructor(): RecordsValueConstructorContext {
        return this.getRuleContext(0, RecordsValueConstructorContext)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public columnNameList(): ColumnNameListContext | null {
        return this.getRuleContext(0, ColumnNameListContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class InsertFromSubqueryContext extends InsertColumnsAndSourceContext {
    public constructor(ctx: InsertColumnsAndSourceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public queryExpression(): QueryExpressionContext {
        return this.getRuleContext(0, QueryExpressionContext)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public columnNameList(): ColumnNameListContext | null {
        return this.getRuleContext(0, ColumnNameListContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}
export class InsertValuesContext extends InsertColumnsAndSourceContext {
    public constructor(ctx: InsertColumnsAndSourceContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public tableValueConstructor(): TableValueConstructorContext {
        return this.getRuleContext(0, TableValueConstructorContext)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.LPAREN, 0);
    }
    public columnNameList(): ColumnNameListContext | null {
        return this.getRuleContext(0, ColumnNameListContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(Sql.RPAREN, 0);
    }
}


export class SetClauseListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public setClause(): SetClauseContext[];
    public setClause(i: number): SetClauseContext | null;
    public setClause(i?: number): SetClauseContext[] | SetClauseContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SetClauseContext);
        }

        return this.getRuleContext(i, SetClauseContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_setClauseList;
    }
}


export class SetClauseContext extends antlr.ParserRuleContext {
    public _updateSource?: ExprContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public setTarget(): SetTargetContext {
        return this.getRuleContext(0, SetTargetContext)!;
    }
    public EQUAL(): antlr.TerminalNode {
        return this.getToken(Sql.EQUAL, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_setClause;
    }
}


export class SetTargetContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public columnName(): ColumnNameContext {
        return this.getRuleContext(0, ColumnNameContext)!;
    }
    public override get ruleIndex(): number {
        return Sql.RULE_setTarget;
    }
}


export class SessionCharacteristicContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_sessionCharacteristic;
    }
    public override copyFrom(ctx: SessionCharacteristicContext): void {
        super.copyFrom(ctx);
    }
}
export class SessionTxCharacteristicsContext extends SessionCharacteristicContext {
    public constructor(ctx: SessionCharacteristicContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TRANSACTION(): antlr.TerminalNode {
        return this.getToken(Sql.TRANSACTION, 0)!;
    }
    public sessionTxMode(): SessionTxModeContext[];
    public sessionTxMode(i: number): SessionTxModeContext | null;
    public sessionTxMode(i?: number): SessionTxModeContext[] | SessionTxModeContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SessionTxModeContext);
        }

        return this.getRuleContext(i, SessionTxModeContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}


export class SessionTxModeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_sessionTxMode;
    }
    public override copyFrom(ctx: SessionTxModeContext): void {
        super.copyFrom(ctx);
    }
}
export class SessionIsolationLevelContext extends SessionTxModeContext {
    public constructor(ctx: SessionTxModeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ISOLATION(): antlr.TerminalNode {
        return this.getToken(Sql.ISOLATION, 0)!;
    }
    public LEVEL(): antlr.TerminalNode {
        return this.getToken(Sql.LEVEL, 0)!;
    }
    public levelOfIsolation(): LevelOfIsolationContext {
        return this.getRuleContext(0, LevelOfIsolationContext)!;
    }
}
export class ReadWriteSessionContext extends SessionTxModeContext {
    public constructor(ctx: SessionTxModeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public READ(): antlr.TerminalNode {
        return this.getToken(Sql.READ, 0)!;
    }
    public WRITE(): antlr.TerminalNode {
        return this.getToken(Sql.WRITE, 0)!;
    }
}
export class ReadOnlySessionContext extends SessionTxModeContext {
    public constructor(ctx: SessionTxModeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public READ(): antlr.TerminalNode {
        return this.getToken(Sql.READ, 0)!;
    }
    public ONLY(): antlr.TerminalNode {
        return this.getToken(Sql.ONLY, 0)!;
    }
}


export class TransactionCharacteristicsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_transactionCharacteristics;
    }
    public override copyFrom(ctx: TransactionCharacteristicsContext): void {
        super.copyFrom(ctx);
    }
}
export class CommonTxCharacteristicsContext extends TransactionCharacteristicsContext {
    public constructor(ctx: TransactionCharacteristicsContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public commonTxMode(): CommonTxModeContext[];
    public commonTxMode(i: number): CommonTxModeContext | null;
    public commonTxMode(i?: number): CommonTxModeContext[] | CommonTxModeContext | null {
        if (i === undefined) {
            return this.getRuleContexts(CommonTxModeContext);
        }

        return this.getRuleContext(i, CommonTxModeContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}
export class ReadWriteTxCharacteristicsContext extends TransactionCharacteristicsContext {
    public constructor(ctx: TransactionCharacteristicsContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public READ(): antlr.TerminalNode {
        return this.getToken(Sql.READ, 0)!;
    }
    public WRITE(): antlr.TerminalNode {
        return this.getToken(Sql.WRITE, 0)!;
    }
    public readWriteTxMode(): ReadWriteTxModeContext[];
    public readWriteTxMode(i: number): ReadWriteTxModeContext | null;
    public readWriteTxMode(i?: number): ReadWriteTxModeContext[] | ReadWriteTxModeContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ReadWriteTxModeContext);
        }

        return this.getRuleContext(i, ReadWriteTxModeContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}
export class ReadOnlyTxCharacteristicsContext extends TransactionCharacteristicsContext {
    public constructor(ctx: TransactionCharacteristicsContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public READ(): antlr.TerminalNode {
        return this.getToken(Sql.READ, 0)!;
    }
    public ONLY(): antlr.TerminalNode {
        return this.getToken(Sql.ONLY, 0)!;
    }
    public readOnlyTxMode(): ReadOnlyTxModeContext[];
    public readOnlyTxMode(i: number): ReadOnlyTxModeContext | null;
    public readOnlyTxMode(i?: number): ReadOnlyTxModeContext[] | ReadOnlyTxModeContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ReadOnlyTxModeContext);
        }

        return this.getRuleContext(i, ReadOnlyTxModeContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}


export class CommonTxModeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_commonTxMode;
    }
    public override copyFrom(ctx: CommonTxModeContext): void {
        super.copyFrom(ctx);
    }
}
export class TxTzModeContext extends CommonTxModeContext {
    public constructor(ctx: CommonTxModeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public txTzOption(): TxTzOptionContext {
        return this.getRuleContext(0, TxTzOptionContext)!;
    }
}
export class IsolationLevelTxModeContext extends CommonTxModeContext {
    public constructor(ctx: CommonTxModeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ISOLATION(): antlr.TerminalNode {
        return this.getToken(Sql.ISOLATION, 0)!;
    }
    public LEVEL(): antlr.TerminalNode {
        return this.getToken(Sql.LEVEL, 0)!;
    }
    public levelOfIsolation(): LevelOfIsolationContext {
        return this.getRuleContext(0, LevelOfIsolationContext)!;
    }
}


export class ReadOnlyTxModeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public commonTxMode(): CommonTxModeContext | null {
        return this.getRuleContext(0, CommonTxModeContext);
    }
    public readOnlyTxOption(): ReadOnlyTxOptionContext | null {
        return this.getRuleContext(0, ReadOnlyTxOptionContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_readOnlyTxMode;
    }
}


export class ReadWriteTxModeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public commonTxMode(): CommonTxModeContext | null {
        return this.getRuleContext(0, CommonTxModeContext);
    }
    public readWriteTxOption(): ReadWriteTxOptionContext | null {
        return this.getRuleContext(0, ReadWriteTxOptionContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_readWriteTxMode;
    }
}


export class BeginWithCharacteristicsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public beginWithMode(): BeginWithModeContext[];
    public beginWithMode(i: number): BeginWithModeContext | null;
    public beginWithMode(i?: number): BeginWithModeContext[] | BeginWithModeContext | null {
        if (i === undefined) {
            return this.getRuleContexts(BeginWithModeContext);
        }

        return this.getRuleContext(i, BeginWithModeContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return Sql.RULE_beginWithCharacteristics;
    }
}


export class BeginWithModeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_beginWithMode;
    }
    public override copyFrom(ctx: BeginWithModeContext): void {
        super.copyFrom(ctx);
    }
}
export class BeginReadWriteWithContext extends BeginWithModeContext {
    public constructor(ctx: BeginWithModeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public READ(): antlr.TerminalNode {
        return this.getToken(Sql.READ, 0)!;
    }
    public WRITE(): antlr.TerminalNode {
        return this.getToken(Sql.WRITE, 0)!;
    }
    public WITH(): antlr.TerminalNode {
        return this.getToken(Sql.WITH, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public beginReadWriteOption(): BeginReadWriteOptionContext[];
    public beginReadWriteOption(i: number): BeginReadWriteOptionContext | null;
    public beginReadWriteOption(i?: number): BeginReadWriteOptionContext[] | BeginReadWriteOptionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(BeginReadWriteOptionContext);
        }

        return this.getRuleContext(i, BeginReadWriteOptionContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}
export class BeginWithIsolationLevelContext extends BeginWithModeContext {
    public constructor(ctx: BeginWithModeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ISOLATION(): antlr.TerminalNode {
        return this.getToken(Sql.ISOLATION, 0)!;
    }
    public LEVEL(): antlr.TerminalNode {
        return this.getToken(Sql.LEVEL, 0)!;
    }
    public levelOfIsolation(): LevelOfIsolationContext {
        return this.getRuleContext(0, LevelOfIsolationContext)!;
    }
}
export class BeginReadOnlyWithContext extends BeginWithModeContext {
    public constructor(ctx: BeginWithModeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public READ(): antlr.TerminalNode {
        return this.getToken(Sql.READ, 0)!;
    }
    public ONLY(): antlr.TerminalNode {
        return this.getToken(Sql.ONLY, 0)!;
    }
    public WITH(): antlr.TerminalNode {
        return this.getToken(Sql.WITH, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(Sql.RPAREN, 0)!;
    }
    public beginReadOnlyOption(): BeginReadOnlyOptionContext[];
    public beginReadOnlyOption(i: number): BeginReadOnlyOptionContext | null;
    public beginReadOnlyOption(i?: number): BeginReadOnlyOptionContext[] | BeginReadOnlyOptionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(BeginReadOnlyOptionContext);
        }

        return this.getRuleContext(i, BeginReadOnlyOptionContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(Sql.COMMA);
    	} else {
    		return this.getToken(Sql.COMMA, i);
    	}
    }
}


export class BeginReadOnlyOptionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public readOnlyTxOption(): ReadOnlyTxOptionContext | null {
        return this.getRuleContext(0, ReadOnlyTxOptionContext);
    }
    public txTzOption(): TxTzOptionContext | null {
        return this.getRuleContext(0, TxTzOptionContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_beginReadOnlyOption;
    }
}


export class BeginReadWriteOptionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public readWriteTxOption(): ReadWriteTxOptionContext | null {
        return this.getRuleContext(0, ReadWriteTxOptionContext);
    }
    public txTzOption(): TxTzOptionContext | null {
        return this.getRuleContext(0, TxTzOptionContext);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_beginReadWriteOption;
    }
}


export class TxOptionValueContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expr(): ExprContext | null {
        return this.getRuleContext(0, ExprContext);
    }
    public DEFAULT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DEFAULT, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_txOptionValue;
    }
}


export class TxTzOptionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public txOptionValue(): TxOptionValueContext {
        return this.getRuleContext(0, TxOptionValueContext)!;
    }
    public TIMEZONE(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIMEZONE, 0);
    }
    public TIME(): antlr.TerminalNode | null {
        return this.getToken(Sql.TIME, 0);
    }
    public ZONE(): antlr.TerminalNode | null {
        return this.getToken(Sql.ZONE, 0);
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_txTzOption;
    }
}


export class ReadOnlyTxOptionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_readOnlyTxOption;
    }
    public override copyFrom(ctx: ReadOnlyTxOptionContext): void {
        super.copyFrom(ctx);
    }
}
export class ClockTimeTxOptionContext extends ReadOnlyTxOptionContext {
    public constructor(ctx: ReadOnlyTxOptionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CLOCK_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.CLOCK_TIME, 0)!;
    }
    public txOptionValue(): TxOptionValueContext {
        return this.getRuleContext(0, TxOptionValueContext)!;
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
}
export class AwaitTokenTxOptionContext extends ReadOnlyTxOptionContext {
    public constructor(ctx: ReadOnlyTxOptionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public AWAIT_TOKEN(): antlr.TerminalNode {
        return this.getToken(Sql.AWAIT_TOKEN, 0)!;
    }
    public txOptionValue(): TxOptionValueContext {
        return this.getRuleContext(0, TxOptionValueContext)!;
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
}
export class SnapshotTimeTxOptionContext extends ReadOnlyTxOptionContext {
    public constructor(ctx: ReadOnlyTxOptionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SNAPSHOT_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.SNAPSHOT_TIME, 0)!;
    }
    public txOptionValue(): TxOptionValueContext {
        return this.getRuleContext(0, TxOptionValueContext)!;
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
}
export class SnapshotTokenTxOptionContext extends ReadOnlyTxOptionContext {
    public constructor(ctx: ReadOnlyTxOptionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SNAPSHOT_TOKEN(): antlr.TerminalNode {
        return this.getToken(Sql.SNAPSHOT_TOKEN, 0)!;
    }
    public txOptionValue(): TxOptionValueContext {
        return this.getRuleContext(0, TxOptionValueContext)!;
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
}


export class ReadWriteTxOptionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_readWriteTxOption;
    }
    public override copyFrom(ctx: ReadWriteTxOptionContext): void {
        super.copyFrom(ctx);
    }
}
export class SystemTimeTxOptionContext extends ReadWriteTxOptionContext {
    public constructor(ctx: ReadWriteTxOptionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SYSTEM_TIME(): antlr.TerminalNode {
        return this.getToken(Sql.SYSTEM_TIME, 0)!;
    }
    public txOptionValue(): TxOptionValueContext {
        return this.getRuleContext(0, TxOptionValueContext)!;
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
}
export class AsyncTxOptionContext extends ReadWriteTxOptionContext {
    public _async?: LiteralContext;
    public constructor(ctx: ReadWriteTxOptionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ASYNC(): antlr.TerminalNode {
        return this.getToken(Sql.ASYNC, 0)!;
    }
    public DEFAULT(): antlr.TerminalNode | null {
        return this.getToken(Sql.DEFAULT, 0);
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
    public literal(): LiteralContext | null {
        return this.getRuleContext(0, LiteralContext);
    }
}
export class MetadataTxOptionContext extends ReadWriteTxOptionContext {
    public constructor(ctx: ReadWriteTxOptionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public METADATA(): antlr.TerminalNode {
        return this.getToken(Sql.METADATA, 0)!;
    }
    public txOptionValue(): TxOptionValueContext {
        return this.getRuleContext(0, TxOptionValueContext)!;
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(Sql.EQUAL, 0);
    }
}


export class LevelOfIsolationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return Sql.RULE_levelOfIsolation;
    }
    public override copyFrom(ctx: LevelOfIsolationContext): void {
        super.copyFrom(ctx);
    }
}
export class RepeatableReadIsolationContext extends LevelOfIsolationContext {
    public constructor(ctx: LevelOfIsolationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public REPEATABLE(): antlr.TerminalNode {
        return this.getToken(Sql.REPEATABLE, 0)!;
    }
    public READ(): antlr.TerminalNode {
        return this.getToken(Sql.READ, 0)!;
    }
}
export class ReadCommittedIsolationContext extends LevelOfIsolationContext {
    public constructor(ctx: LevelOfIsolationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public READ(): antlr.TerminalNode {
        return this.getToken(Sql.READ, 0)!;
    }
    public COMMITTED(): antlr.TerminalNode {
        return this.getToken(Sql.COMMITTED, 0)!;
    }
}
export class ReadUncommittedIsolationContext extends LevelOfIsolationContext {
    public constructor(ctx: LevelOfIsolationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public READ(): antlr.TerminalNode {
        return this.getToken(Sql.READ, 0)!;
    }
    public UNCOMMITTED(): antlr.TerminalNode {
        return this.getToken(Sql.UNCOMMITTED, 0)!;
    }
}
export class SerializableIsolationContext extends LevelOfIsolationContext {
    public constructor(ctx: LevelOfIsolationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public SERIALIZABLE(): antlr.TerminalNode {
        return this.getToken(Sql.SERIALIZABLE, 0)!;
    }
}
