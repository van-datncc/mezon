import React, { Component } from 'react';
import { MentionsInput, Mention, MentionData } from 'react-mentions';

type YourComponentProps = {
    users: MentionData[];
}

type YourComponentState = {
    value: string;
}

class YourComponent extends Component<YourComponentProps, YourComponentState> {
    constructor(props: YourComponentProps) {
        super(props);
        this.state = {
            value: '',
        };
    }

    handleChange = (value: string) => {
        this.setState({ value });
    }

    renderUserSuggestion = (suggestion: MentionData, search: string, highlightedDisplay: React.ReactNode) => {
        return (
            <div className="user-suggestion">
                {highlightedDisplay}
            </div>
        );
    }

    renderTagSuggestion = (suggestion: MentionData, search: string, highlightedDisplay: React.ReactNode) => {
        return (
            <div className="tag-suggestion">
                {highlightedDisplay}
            </div>
        );
    }

    render() {
        return (
            <MentionsInput value={this.state.value} onChange={this.handleChange}>
                <Mention trigger="@" data={this.props.users} renderSuggestion={this.renderUserSuggestion} />
                <Mention trigger="#" data={this.requestTag} renderSuggestion={this.renderTagSuggestion} />
            </MentionsInput>
        );
    }
}

export default YourComponent;
