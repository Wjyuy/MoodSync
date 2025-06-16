package com.boot.userRecord.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class YoutubeVideoDTO {
    private String title;
    private String channel;
    private String thumbnail;
    private String videoUrl;
}
