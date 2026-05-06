package com.conectafamilia.backend.service;

import com.conectafamilia.backend.model.entity.ForumPostState;

public class ForumStateMachine {

    public static ForumPostState transition(ForumPostState currentState, String event) {
        if (currentState == null) {
            return ForumPostState.OPEN;
        }
        return switch (event == null ? "" : event.toUpperCase()) {
            case "PUBLISH" -> currentState.canTransitionTo(ForumPostState.OPEN) ? ForumPostState.OPEN : currentState;
            case "RESOLVE" ->
                    currentState.canTransitionTo(ForumPostState.RESOLVED) ? ForumPostState.RESOLVED : currentState;
            case "CLOSE" -> currentState.canTransitionTo(ForumPostState.CLOSED) ? ForumPostState.CLOSED : currentState;
            case "REOPEN" -> currentState.canTransitionTo(ForumPostState.OPEN) ? ForumPostState.OPEN : currentState;
            default -> currentState;
        };

    }
}
