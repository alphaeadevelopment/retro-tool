# Retrospective Tool

## Install
Either [install and run the server on your local machine](https://github.com/alphaeadevelopment/retro-tool/blob/master/docs/README.md) or use the
[free hosted service](https://retro-tool.herokuapp.com/).

_IMPORTANT: No assurances are made in respect of either the resilience or the security of data submitted to the hosted service. Although the hosted service does persist session data in a mongo database, it will periodically sweep and purge any sessions that have no connected users. This is to ensure that the size of the datastore remains within free usage limits._

## Start a new session
Click the 'Host new session' link and enter your name when prompted.
![Session Link](./static/images/launch-page.png "Launch Page")

## Share the generated session id or link with participants
![Session Link](./static/images/session-link.png "Session Link")

## Monitor as participants join and submit responses
![Responses](./static/images/responses.png "Responses")

## Add additional questions
![Add New Question](./static/images/add-new-question-button.png "Add New Question")

![Add New Question Form](./static/images/add-new-question-form.png "Add New Question Form")

![New Question Form](./static/images/new-question-form.png "New Question Form")

![New Question Responses](./static/images/new-question-responses.png "New Question Responses")

## Block inappropriate/duplicated responses
Block inappropriate or duplicated responses:

![Block Response](./static/images/block-response.png "Block Response")

Provide a reason:

![Block Response Dialog](./static/images/block-dialog.png "Block Response Dialog")

The user will receive a notification and reason:

![Block Response Notification](./static/images/block-response-notification.png "Block Response Notification")

## Start voting

Session owner can open for votes.

![Open For Voting](./static/images/open-for-voting-button.png "Open For Voting")

At this point, all participants can see others' responses and vote on their top three responses. Blocked responses are not shown.

![Cast Votes](./static/images/cast-votes.png "Cast Votes")

All users can see the number of votes cast be each participant.

![Number of Votes Cast](./static/images/num-votes-cast.png "Number of Votes Cast")

## Close for discussion

The session owner can go back to the previous state and allow additional responses, or finalise the session so that all participants can see votes for each response.

![Workflow Buttons2](./static/images/workflow-buttons2.png "Workflow Buttons")

