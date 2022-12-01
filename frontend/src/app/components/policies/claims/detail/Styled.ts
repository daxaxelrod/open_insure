import styled from "styled-components";
import colors from "../../../../constants/colors";

export const SideText = styled.div({
    fontSize: 12,
    color: colors.gray7,
});

export const CaptionText = styled.div({
    fontSize: 10,
    color: colors.gray7,
});

export const ClaimVotingBox = styled.div({
    display: "flex",
    flexDirection: "column",
    padding: "1.25rem",
});

export const ClaimMetaDataContainer = styled.div(
    ({ top }: { top: boolean }) => ({
        marginTop: top ? "2rem" : 0,
    })
);
