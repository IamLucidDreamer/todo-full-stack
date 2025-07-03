from rest_framework.renderers import JSONRenderer
from django.conf import settings

class CustomJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get('response', None)
        request = renderer_context.get('request', None)

        success = True
        message = 'Request successful'
        status_code = 200
        meta = None

        # If there's an error
        if response is not None and response.status_code >= 400:
            success = False
            status_code = response.status_code
            message = data.get('detail', 'Request failed')
            data = data if settings.DEBUG else None 

        if hasattr(request, 'custom_message'):
            message = request.custom_message

        if isinstance(data, dict) and 'results' in data:
            meta = {
                'count': data.get('count'),
                'next': data.get('next'),
                'previous': data.get('previous')
            }
            data = data.get('results') 

        final_response = {
            'success': success,
            'message': message,
            'data': data,
        }

        if meta:
            final_response['meta'] = meta

        return super().render(final_response, accepted_media_type, renderer_context)
