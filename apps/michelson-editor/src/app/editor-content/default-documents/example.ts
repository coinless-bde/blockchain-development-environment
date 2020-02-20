export const EXAMPLE = `NIL @operations operation; SWAP;
UNPAPAIR @% @% @%; DIP {DUP};
IF_LEFT
  {
    IF_LEFT
      {
        UNPAIR @% @%;
        DUP; CONTRACT @participant unit; IF_SOME {DROP} { PUSH string "wrong participant address"; FAILWITH };
        SWAP; UNPPAIIR @% @% @%;
        DUP; SIZE; PUSH nat 32; IFCMPEQ {} {PUSH string "hash size is not correct"; FAILWITH };
        DIP
          {
            DUP; NOW; IFCMPLT {} { PUSH string "wrong refund_time"; FAILWITH };
            DIP { DUP }; SWAP;
            AMOUNT @amount; SUB;
            SENDER;
            DUP; CONTRACT @initiator unit; IF_SOME {DROP} { PUSH string "wrong sender address"; FAILWITH };
            DIP { PPAIIR; SWAP; }; PPAIIR; SOME @xcat;
            SWAP;
          };
        DUP; DIP { MEM; NOT; IF {} {PUSH string "swap for this hash is already initiated"; FAILWITH} };
      }
      {
        DUP;
        DIP
          {
            GET; IF_SOME {} { PUSH string "no swap for such hash"; FAILWITH };
            UNPAIR @% @%;
            DIP
              {
                UNPPAIIR @% @% @%; SWAP;
                DUP; NOW; IFCMPLT {} { PUSH string "refund_time has already come"; FAILWITH }; SWAP;
                AMOUNT @amount; ADD;
              };
            PAPPAIIR; SOME @xcat;
          };
      };
    UPDATE; PAIR @new_storage; SWAP; PAIR;
  }
  {
    IF_LEFT
      {
        PUSH mutez 0; AMOUNT; IFCMPEQ {} {PUSH string "can not accept tez"; FAILWITH };
        DUP; SIZE; PUSH nat 32; IFCMPEQ {} {PUSH string "secret size is not correct"; FAILWITH };
        SHA256; SHA256 @hash; DUP; DIP {SWAP};
        DIIP
          {
            GET; IF_SOME {} { PUSH string "no swap for such secret"; FAILWITH };
            DUP; UNPAIR @% @%; CDR @%; CONTRACT @participant unit; IF_SOME {} { PUSH string "recipient does not exist"; FAILWITH };
            SWAP; CAAR @%;
            DIIP
              {
                SENDER;
                CONTRACT @sender unit; IF_SOME {} { PUSH string "wrong sender address"; FAILWITH };
                SWAP; CDR @%; UNPPAIIR @% @% @%; DROP;
                NOW; IFCMPLT {} { PUSH string "refund_time has already come"; FAILWITH };
                DUP; PUSH mutez 0;
                IFCMPLT
                  {
                    UNIT; TRANSFER_TOKENS;
                    DIP {SWAP}; CONS;
                  }
                  {
                    DROP; DROP; SWAP
                  };
              };
            UNIT; TRANSFER_TOKENS;
          };
      }
      {
        PUSH mutez 0; AMOUNT; IFCMPEQ {} {PUSH string "can not accept tez"; FAILWITH };
        DUP;
        DIP
          {
            GET; IF_SOME {} { PUSH string "no swap for such hash"; FAILWITH };
            DUP; CAAR @%; CONTRACT @initiator unit; IF_SOME {} { PUSH string "recipient does not exist"; FAILWITH }; SWAP;
            CDR; UNPPAIIR @% @% @%; SWAP;
            NOW; IFCMPGE {} { PUSH string "refund_time has not come"; FAILWITH };
            ADD;
            UNIT; TRANSFER_TOKENS; SWAP;
            DIIP {SWAP};
          };
      };
    NONE @none (pair (pair address address) (pair (pair mutez timestamp) mutez));
    SWAP; UPDATE @cleared_map; SWAP; DIP { SWAP; DIP {PAIR} };
    CONS; PAIR;
  }`
