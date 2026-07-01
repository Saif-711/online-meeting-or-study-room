package com.online.study_meet.Exception;

public class NotMemberException extends RuntimeException{
    public NotMemberException(){
        super("Not Member");
    }
    public NotMemberException(String msg){
        super(msg);
    }
}
