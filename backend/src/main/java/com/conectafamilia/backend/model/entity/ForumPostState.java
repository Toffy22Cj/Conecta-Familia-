package com.conectafamilia.backend.model.entity;

public enum ForumPostState {
    DRAFT,
    OPEN,
    RESOLVED,
    CLOSED;

    public boolean canTransitionTo(ForumPostState next) {
        return switch (this) {
            case DRAFT -> next == OPEN || next == CLOSED;
            case OPEN -> next == RESOLVED || next == CLOSED;
            case RESOLVED -> next == CLOSED || next == OPEN;
            case CLOSED -> next == OPEN;
        };
    }
}
