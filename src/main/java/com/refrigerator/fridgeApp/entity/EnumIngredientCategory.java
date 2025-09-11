package com.refrigerator.fridgeApp.entity;

import lombok.Getter;

@Getter
public enum EnumIngredientCategory {
    MEAT("육류"),
    FISH("어류"),
    VEGETABLE("채소"),
    FRUIT("과일"),
    DAIRY("유제품"),
    GRAIN("곡물"),
    SEASONING("조미료"),
    NOODLE("면류"),
    SIDE("반찬"),
    SEAFOOD("해산물"),
    NUT("견과류"),
    BREAD("빵류"),
    RICE_CAKE("떡류"),
    SAUCE("소스"),
    FROZEN("냉동식품"),
    DRINK("음료"),
    INSTANT("인스턴트"),
    OTHER("기타");

    private final String label;

    EnumIngredientCategory(String label) {
        this.label = label;
    }
}
