package com.refrigerator.fridgeApp.entity;

import lombok.Getter;

@Getter
public enum GoalCode {
    FAT_LOSS("체중 감량"),
    FAT_MAINTAIN("체중 유지"),
    WEIGHT_GAIN("체중 증가"),
    PROTEIN_INTAKE("단백질 보충"),
    IMMUNITY_BOOST("면역력 강화"),
    IMPROVE_STAMINA("체력 향상"),
    BLOOD_SUGAR_CONTROL("혈당 관리");

    private final String displayName;

    GoalCode(String displayName) {
        this.displayName = displayName;
    }

}
