package com.online.study_meet.Exception;


public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(){
        super("User Not Found");
    }
    public UserNotFoundException(String msg){
        super(msg);
    }
}
