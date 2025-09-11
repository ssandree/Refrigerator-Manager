package com.refrigerator.fridgeApp.entity;

import lombok.Getter;

@Getter
public enum EnumStorageLocation {
    FRIDGE("냉장고"),
    FREEZER("냉동고"),
    ROOM_TEMP("상온");

    private final String name;

    EnumStorageLocation(String name) {
        this.name = name;
    }
}
