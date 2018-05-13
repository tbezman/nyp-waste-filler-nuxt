<template>
    <div class="flex flex-column space around top-room">
        <div class="row center-xs">
            <h4>Here is where you will upload your Waste Logs</h4>
        </div>

        <div class="row center-xs animate">
            <p class="leggible" v-if="!uploaded">
                In order to upload your waste logs. Click on 'Select Files'. Select your waste record file. Click
                Done. Once you have clicked done. We will begin processing your file. Please be patient as this process
                is a resource intensive task. It may take a couple of minutes depending on how new your computer is.
            </p>

            <div v-if="uploaded">
                <FileDisplay v-for="file in files" :path="file" :key="file" @remove="removeFile" />
            </div>
        </div>

        <div class="row around-xs">
            <button @click="selectFile">Select Files</button>
            <button @click="next" class="button" :class="{'button-outline': !uploaded}" :disabled="!uploaded">Next
            </button>
        </div>

        <Spinner v-if="spinning" />
    </div>
</template>

<script>
    import FileDisplay from "../components/FileDisplay";
    import Component, { Action, State, Mutation } from 'nuxt-class-component';
    import Vue from 'vue';

    import { remote, ipcRenderer } from 'electron';
    import Spinner from "../components/Spinner";

    @Component({
        components: { Spinner, FileDisplay }
    })
    export default class extends Vue {
        @Action('session/chooseFiles') chooseFile;
        @State(state => state.session.files.logs) files;

        spinning = false;

        mounted() {
            ipcRenderer.on('base64', async (event, files) => {
                await this.logs.bulkDocs(files.map(file => ({
                    _id: file,
                    type: 'pdf_file',
                })));

                this.$router.push({ path: '/pdf-filler' })
            });
        }

        get uploaded() {
            let files = this.files.logs;

            return this.files && this.files.length > 0;
        }

        selectFile() {
            remote.dialog.showOpenDialog(null, {}, files => {
                if (!files) return;

                this.chooseFile({ name: 'logs', files })
            });
        }

        removeFile(file) {
            this.$store.dispatch('session/removeFile', { name: 'logs', file });
        }

        async next() {
            this.spinning = true;

            await this.resetLogs();

            ipcRenderer.send('base64', this.files);
        }
    }
</script>
