package com.boot.analize.util;

public class CustomPair<K, V> {
    private K key;
    private V value;

    public CustomPair(K key, V value){
        this.key = key;
        this.value = value;
    }

    public K getKey() {
        return key;
    }

    public V getValue() {
        return value;
    }
}